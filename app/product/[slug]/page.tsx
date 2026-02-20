"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Heart, ShoppingBag, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductGallery } from "@/components/product-gallery"
import { VariantSelector } from "@/components/variant-selector"
import { ProductInfo } from "@/components/product-info"
import { ProductCarousel } from "@/components/product-carousel"
import { getProductBySlug, products } from "@/lib/products"
import { formatCurrency, calculateInstallments } from "@/lib/currency"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { cn } from "@/lib/utils"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = getProductBySlug(slug)

  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color || "")
  const [selectedSize, setSelectedSize] = useState("")

  const addToCart = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const { isInWishlist, toggleItem } = useWishlistStore()

  if (!product) {
    notFound()
  }

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor selecciona un talle")
      return
    }

    addToCart(product, selectedColor, selectedSize)
    toast.success("Producto agregado al carrito", {
      action: {
        label: "Ver carrito",
        onClick: () => openCart(),
      },
    })
  }

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: product.category, href: `/category/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product Details */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex gap-2">
            {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">Nuevo</Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.category}</p>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-secondary">{calculateInstallments(product.price)}</p>
          </div>

          {/* Variants */}
          <VariantSelector
            variants={product.variants}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Agregar al Carrito
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(inWishlist && "text-destructive border-destructive")}
              onClick={() => toggleItem(product)}
            >
              <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              <span className="sr-only">
                {inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
              </span>
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Compartir</span>
            </Button>
          </div>

          {/* Product Info Tabs */}
          <ProductInfo description={product.description} />
        </div>
      </div>

      {/* Related Products */}
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
