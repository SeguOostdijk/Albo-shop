"use client"

import React, { useState, useEffect } from "react"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Eye, Check, Minus, Plus } from "lucide-react"
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
  const isInCartFn = useCartStore((state) => state.isInCart)
  const getItemQuantityFn = useCartStore((state) => state.getItemQuantity)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const openCart = useCartStore((state) => state.openCart)
  const inWishlist = isInWishlist(product.id)
  
  const [quantity, setQuantity] = useState(1)
  const [isInCart, setIsInCart] = useState(false)
  const [cartQuantity, setCartQuantity] = useState(0)
  
  const defaultVariant = product.variants?.[0]
  const defaultColor = defaultVariant?.color || "Unico"
  const defaultSize = defaultVariant?.sizes?.[0] || "Unico"
  
  // Check cart status
  useEffect(() => {
    const inCart = isInCartFn(product.id, defaultColor, defaultSize)
    setIsInCart(inCart)
    if (inCart) {
      setCartQuantity(getItemQuantityFn(product.id, defaultColor, defaultSize))
    }
  }, [product.id, defaultColor, defaultSize, isInCartFn, getItemQuantityFn])
  
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0
  
  const installmentPrice = product.price / 3

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, defaultColor, defaultSize, quantity)
    setIsInCart(true)
    setCartQuantity(quantity)
    toast.success(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} agregadas al carrito`)
    openCart()
  }

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newQty = cartQuantity + 1
    if (newQty <= 10) {
      updateQuantity(product.id, defaultColor, defaultSize, newQty)
      setCartQuantity(newQty)
    }
  }

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newQty = cartQuantity - 1
    if (newQty <= 0) {
      setIsInCart(false)
      setCartQuantity(0)
    } else {
      updateQuantity(product.id, defaultColor, defaultSize, newQty)
      setCartQuantity(newQty)
    }
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
              "h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-card/90 hover:bg-card hover:scale-110 transition-transform cursor-pointer",
              inWishlist ? "text-destructive bg-destructive/10" : "text-foreground"
            )}
            onClick={(e) => {
              e.preventDefault()
              toggleItem(product)
            }}
          >
            <Heart className={cn("h-5 w-5", inWishlist ? "fill-current" : "fill-none stroke-current")} />
            <span className="sr-only">
              {inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
            </span>
          </Button>
        </div>

        {/* Quick Add Button - Appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {isInCart ? (
            /* Added to Cart - Button to remove */
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-xl cursor-pointer relative"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                useCartStore.getState().removeItem(product.id, defaultColor, defaultSize)
                setIsInCart(false)
                setCartQuantity(0)
                toast.info(`${product.name} eliminado del carrito`)
              }}
            >
              <span className="relative">
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-2 -right-2 bg-white text-green-500 rounded-full p-0.5">
                  <Check className="h-2 w-2" />
                </span>
              </span>
            </Button>
          ) : (
            /* Add to Cart Button */
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:brightness-110 rounded-full font-semibold shadow-xl gap-2 cursor-pointer"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              AGREGAR AL CARRITO
            </Button>
          )}
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
