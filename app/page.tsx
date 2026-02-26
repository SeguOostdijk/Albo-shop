import { Hero } from "@/components/hero"
import { ProductCarousel } from "@/components/product-carousel"
import { CategoryBanner } from "@/components/category-banner"
import { BenefitsBar } from "@/components/benefits-bar"
import { getFeaturedProducts, getNewProducts, products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
  const newProducts = getNewProducts()
  const saleProducts = products.filter(p => p.originalPrice)

  return (
    <>
      {/* Hero Slider */}
      <Hero />

      {/* Category Banners - Hombre, Mujer, Ninos */}
      <CategoryBanner />


      {/* New Products */}
      <ProductCarousel
        title="Destacado"
        subtitle="PRODUCTOS DESTACADOS"
        products={featuredProducts}
        viewAllHref="/category/novedades"
      />

      {/* More Products Grid */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-0 mb-6">
            <div className="w-1 h-14 bg-primary mr-4" />
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider">EXTRAS</p>
              <h2 className="text-2xl md:text-3xl font-bold text-accent uppercase">ACCESORIOS</h2>
            </div>
          </div>
        <ProductCarousel
            products={products.filter((product) => product.categorySlug === "accesorios")}
            viewAllHref="/category/accesorios"
            showDots={false}
          />
        </div>
      </section>
    </>
  )
}
