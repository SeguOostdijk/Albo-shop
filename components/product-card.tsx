"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/type/products"
import { formatCurrency } from "@/lib/currency"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useCartStore } from "@/lib/cart-store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore()
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const items = useCartStore((state) => state.items)
  const openCart = useCartStore((state) => state.openCart)

  const inWishlist = isInWishlist(product.id)

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const installmentPrice = product.price / 3

  const defaultVariant = product.variants?.[0]
  const defaultColor = defaultVariant?.color || "Unico"
  const defaultSize = "Unico"

  const inCart = items.some(
    (item) =>
      item.product.id === product.id &&
      item.selectedColor === defaultColor &&
      item.selectedSize === defaultSize
  )

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inCart) {
      removeItem(product.id, defaultColor, defaultSize)
      toast.success(`${product.name} eliminado del carrito`)
    } else {
      addItem(product, defaultColor, defaultSize)
      openCart()
    }
  }

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10",
        className
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-muted/50 to-muted"
      >
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 sm:p-5 md:p-6"
sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 sm:left-4 sm:top-4">
          {discountPercent > 0 && (
            <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold tracking-wide text-destructive-foreground shadow-lg sm:px-3 sm:py-1.5 sm:text-xs">
              -{discountPercent}%
            </span>
          )}

          {product.isNew && (
            <span className="inline-flex items-center rounded-full bg-success px-2.5 py-1 text-[10px] font-bold tracking-wide text-success-foreground shadow-lg sm:px-3 sm:py-1.5 sm:text-xs">
              NUEVO
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-100 transition-all duration-300 sm:right-4 sm:top-4 md:translate-x-4 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full bg-card/90 shadow-lg backdrop-blur-sm transition-transform cursor-pointer hover:scale-110 hover:bg-card sm:h-10 sm:w-10",
              inWishlist ? "bg-destructive/10 text-destructive" : "text-foreground"
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleItem(product)
            }}
          >
            <Heart
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5",
                inWishlist ? "fill-current" : "fill-none stroke-current"
              )}
            />
            <span className="sr-only">
              {inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
            </span>
          </Button>
        </div>

        {/* Quick Add Desktop - igual al estilo original */}
        <div className="absolute bottom-0 left-0 right-0 hidden translate-y-full p-4 transition-transform duration-300 md:block md:group-hover:translate-y-0">
          <Button
            className={cn(
              "w-full rounded-full font-semibold shadow-xl gap-2 cursor-pointer",
              inCart
                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={handleCartAction}
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4" />
              {inCart && (
                <Check className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-white text-green-500" />
              )}
            </div>
            {inCart ? "EN EL CARRITO" : "AGREGAR AL CARRITO"}
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 space-y-2 sm:p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-primary/70 sm:text-xs">
          {product.category}
        </p>

        <Link href={`/product/${product.slug}`} className="block min-w-0">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug transition-colors hover:text-primary sm:min-h-[3rem] md:text-lg md:font-bold md:leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-foreground sm:text-xl">
            {formatCurrency(product.price)}
          </span>

          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through sm:text-sm">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground sm:text-xs">
          <span className="font-medium text-success">3 cuotas sin interes</span> de{" "}
          {formatCurrency(installmentPrice)}
        </p>

        {product.memberPrice && (
          <p className="mt-1 text-xs font-bold text-primary sm:text-sm">
            Precio socio: {formatCurrency(product.memberPrice)}
          </p>
        )}

        {product.variants.length > 1 && (
          <div className="flex items-center gap-1 pt-1">
            {product.variants.slice(0, 4).map((variant: any, index: number) => (
              <div
                key={index}
                className="h-3.5 w-3.5 rounded-full border-2 border-border shadow-sm sm:h-4 sm:w-4"
                style={{ backgroundColor: variant.colorHex || "#ccc" }}
                title={variant.color}
              />
            ))}

            {product.variants.length > 4 && (
              <span className="ml-1 text-[11px] text-muted-foreground sm:text-xs">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Mobile / Tablet Add to Cart */}
        <div className="mt-auto pt-3 md:hidden">
          <Button
            className="w-full px-2 text-[11px] font-semibold cursor-pointer sm:px-3 sm:text-sm"
            onClick={handleCartAction}
            variant={inCart ? "secondary" : "default"}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4 shrink-0" />
            <span className="sm:hidden">{inCart ? "EN CARRITO" : "AGREGAR"}</span>
            <span className="hidden sm:inline">
              {inCart ? "EN CARRITO" : "AÑADIR AL CARRITO"}
            </span>
          </Button>
        </div>
      </div>
    </article>
  )
}