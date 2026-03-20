"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
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
  const openCart = useCartStore((state) => state.openCart)

  const inWishlist = isInWishlist(product.id)

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const installmentPrice = product.price / 3

  const sizes = useMemo(() => {
    const preferredOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]

    const rawSizes = Array.isArray(product.stockBySize) ? product.stockBySize : []

    return [...rawSizes].sort((a, b) => {
      const ia = preferredOrder.indexOf(a.size)
      const ib = preferredOrder.indexOf(b.size)

      if (ia === -1 && ib === -1) return a.size.localeCompare(b.size)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
  }, [product.stockBySize])

  const defaultColor = product.variants?.[0]?.color || "Unico"

  const handleAddSize = (
    size: string,
    stock: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (stock <= 0) return

    addItem(product, defaultColor, size)
    openCart()
    toast.success(`${product.name} agregado al carrito (${size})`)
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

        {sizes.length > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
              Añadir talle
            </p>

            <div className="flex flex-wrap gap-2">
              {sizes.map((item) => {
                const inStock = item.stock > 0

                return (
                  <button
                    key={item.size}
                    type="button"
                    disabled={!inStock}
                    onClick={(e) => handleAddSize(item.size, item.stock, e)}
                    className={cn(
                      "min-w-10 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition sm:min-w-11 sm:text-sm",
                      inStock
                        ? "cursor-pointer border-border bg-background hover:border-primary hover:text-primary"
                        : "cursor-not-allowed border-border/60 text-muted-foreground line-through opacity-50"
                    )}
                    title={inStock ? `Agregar talle ${item.size}` : `Talle ${item.size} agotado`}
                  >
                    {item.size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3">
          <Button
            asChild
            className="w-full px-2 text-[11px] font-semibold cursor-pointer sm:px-3 sm:text-sm"
          >
            <Link href={`/product/${product.slug}`}>COMPRAR</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}