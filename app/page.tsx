import { Hero } from "@/components/hero"
import { CategoryIcons } from "@/components/category-icons"
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

      {/* Category Icons Row */}
      <CategoryIcons />

      {/* Category Banners - Hombre, Mujer, Ninos */}
      <CategoryBanner />

      {/* Oportunidades Unicas - Sale Products */}
      <ProductCarousel
        title="Unicas"
        subtitle="OPORTUNIDADES"
        products={saleProducts.length > 0 ? saleProducts : featuredProducts}
        viewAllHref="/category/oportunidades"
      />

      {/* Benefits Bar */}
      <BenefitsBar />

      {/* New Products */}
      <ProductCarousel
        title="Novedades"
        subtitle="NUEVA TEMPORADA"
        products={newProducts}
        viewAllHref="/category/novedades"
      />

      {/* More Products Grid */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-0 mb-6">
            <div className="w-1 h-14 bg-primary mr-4" />
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider">LO MAS</p>
              <h2 className="text-2xl md:text-3xl font-bold text-accent uppercase">Vendido</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Second Benefits Bar */}
      <BenefitsBar />
    </>
  )
}
