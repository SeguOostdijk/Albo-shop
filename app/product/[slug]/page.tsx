import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductCarousel } from "@/components/product-carousel"
import { getProductBySlugFromDb, getProductsByCategoryFromDb } from "@/lib/products-db"
import { formatCurrency, calculateInstallments } from "@/lib/currency"
import { ProductVariantSection } from "@/components/product-variant-section"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await getProductBySlugFromDb(slug)
  if (!product) {
    notFound()
  }

  const relatedProducts = (await getProductsByCategoryFromDb(product.categorySlug))
    .filter((p) => p.id !== product.id)
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
            <p className="text-sm text-secondary">
              {calculateInstallments(product.price)}
            </p>
          </div>

          {/* Variants */}
          <ProductVariantSection variants={product.variants} product={product} />
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