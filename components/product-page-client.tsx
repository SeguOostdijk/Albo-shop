"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Share2, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductGallery } from "@/components/product-gallery"
import { VariantSelector } from "@/components/variant-selector"
import { ProductCarousel } from "@/components/product-carousel"
import { formatCurrency, calculateInstallments } from "@/lib/currency"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/type/products"

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [selectedColor, setSelectedColor ] = useState(product.variants[0]?.color || "")
  const [selectedSize, setSelectedSize] = useState("")

  const addToCart = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const items = useCartStore((state) => state.items)
  const openCart = useCartStore((state) => state.openCart)
  const { isInWishlist, toggleItem } = useWishlistStore()

  const inWishlist = isInWishlist(product.id)

  const inCart = items.some(
    (item) =>
      item.product.id === product.id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  )

  const handleCartAction = () => {
    if (!selectedSize && !inCart) {
      toast.error("Por favor selecciona un talle")
      return
    }

    if (inCart) {
      removeItem(product.id, selectedColor, selectedSize)
      toast.success(`${product.name} eliminado del carrito`)
    } else {
      addToCart(product, selectedColor, selectedSize)
      openCart()
    }
  }

  console.log("PRODUCT", product)
  console.log("STOCK BY SIZE", product.stockBySize)

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: product.category, href: `/category/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <div className="flex gap-2 items-center flex-wrap">
            {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">Nuevo</Badge>
            )}

            {product.originalPrice && (
              <Badge variant="destructive">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.category}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-sm text-secondary">
              {calculateInstallments(product.price)}
            </p>
{product.memberPrice && (
              <p className="text-lg text-primary font-bold mt-2 mb-0">
                Precio socio: {formatCurrency(product.memberPrice)}
              </p>
            )}
          </div>

          <VariantSelector
            variants={product.variants}
            stockBySize={product.stockBySize}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />

          <div className="flex gap-3">
            <Button
              size="lg"
              className={cn(
                "flex-1 cursor-pointer gap-2",
                inCart ? "bg-green-500 text-white hover:bg-green-600" : ""
              )}
              onClick={handleCartAction}
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {inCart && (
                  <Check className="h-2.5 w-2.5 absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />
                )}
              </div>
              {inCart ? "EN EL CARRITO" : "Agregar al Carrito"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className={cn(
                inWishlist ? "text-destructive border-destructive" : "text-foreground",
                "cursor-pointer"
              )}
              onClick={() => toggleItem(product)}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  inWishlist ? "fill-current" : "fill-none stroke-current"
                )}
              />
              <span className="sr-only">
                {inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
              </span>
            </Button>

            <Button size="lg" variant="outline" className="cursor-pointer" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: document.title,
                  url: window.location.href
                }).catch(console.error)
              } else {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Link copiado al portapapeles')
              }
            }}>
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Compartir</span>
            </Button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <ProductCarousel
            title="Tambien te puede gustar"
            products={relatedProducts}
            viewAllHref={`/category/${product.categorySlug}`}
          />
        </div>
      )}
    </div>
  )
}
