"use client"

import React from "react"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
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
  const inWishlist = isInWishlist(product.id)
  
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0
  
  const installmentPrice = product.price / 3

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultVariant = product.variants?.[0]
    const defaultColor = defaultVariant?.color || "Unico"
    const defaultSize = defaultVariant?.sizes?.[0]?.size || "Unico"
    addItem(product, defaultColor, defaultSize)
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <div className={cn(
      "group relative bg-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
      className
    )}>
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold tracking-wide shadow-lg">
              -{discountPercent}%
            </span>
          )}
          
          {/* New Badge */}
          {product.isNew && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-success text-success-foreground text-xs font-bold tracking-wide shadow-lg">
              NUEVO
            </span>
          )}
        </div>

        {/* Action Buttons - Appear on hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-card/90 hover:bg-card hover:scale-110 transition-transform",
              inWishlist && "text-destructive bg-destructive/10"
            )}
            onClick={(e) => {
              e.preventDefault()
              toggleItem(product)
            }}
          >
            <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
            <span className="sr-only">
              {inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
            </span>
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-card/90 hover:bg-card hover:scale-110 transition-transform"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/product/${product.slug}`
            }}
          >
            <Eye className="h-5 w-5" />
            <span className="sr-only">Ver detalles</span>
          </Button>
        </div>

        {/* Quick Add Button - Appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold shadow-xl gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            AGREGAR AL CARRITO
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <p className="text-xs font-medium text-primary/70 uppercase tracking-wider">{product.category}</p>
        
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Prices */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-bold text-foreground">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Installments */}
        <p className="text-xs text-muted-foreground">
          <span className="text-success font-medium">3 cuotas sin interes</span> de {formatCurrency(installmentPrice)}
        </p>

        {/* Color Options Preview */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1 pt-1">
            {product.variants.slice(0, 4).map((variant, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-border shadow-sm"
                style={{ backgroundColor: variant.colorHex || '#ccc' }}
                title={variant.color}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">+{product.variants.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
