export const revalidate = 60

import { Hero } from "@/components/hero"
import { ProductCarousel } from "@/components/product-carousel"
import { CategoryBanner } from "@/components/category-banner"
import {
  getFeaturedProductsFromDb,
  getSaleProductsFromDb,
  getAllProductsFromDb,
} from "@/lib/products-db"
import { BenefitsBar } from "@/components/benefits-bar"
import { SponsorsCarousel } from "@/components/sponsors-carousel"

export default async function HomePage() {
  const [featuredProducts, saleProducts, allProducts] = await Promise.all([
    getFeaturedProductsFromDb(),
    getSaleProductsFromDb(),
    getAllProductsFromDb(),
  ])

  const extrasProducts = allProducts.filter(
    (product) => product.categorySlug === "extras"
  )

  return (
    <>
      {/* Hero Slider */}
      <Hero />

      {/* Category Banners */}
      <CategoryBanner />

      {/* Featured Products */}
      <ProductCarousel
        title="Destacado"
        subtitle="PRODUCTOS DESTACADOS"
        products={featuredProducts}
        viewAllHref="/category/novedades"
      />

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <ProductCarousel
          title="Ofertas"
          subtitle="PRODUCTOS EN OFERTA"
          products={saleProducts}
          viewAllHref="/category/oportunidades"
        />
      )}

      {/* Extras / Accesorios */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-0 mb-6">
            <div className="w-1 h-14 bg-primary mr-4" />
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider">
                Accesorios
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-accent uppercase">
                Extras
              </h2>
            </div>
          </div>

  <ProductCarousel
            products={extrasProducts}
            viewAllHref="/category/extras"
            showDots={false}
          />
        </div>
      </section>

      {/* Sponsors Carousel */}
      <SponsorsCarousel />

      {/* Benefits Bar */}
      <BenefitsBar />
    </>
  )
}
