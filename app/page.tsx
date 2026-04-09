export const revalidate = 60

import { Hero } from "@/components/hero"
import { ProductCarousel } from "@/components/product-carousel"
import { CategoryBanner } from "@/components/category-banner"
import {
  getFeaturedProductsFromDb,
  getNewProductsFromDb,
  getSaleProductsFromDb,
  getProductsByCategoryFromDb,
} from "@/lib/products-db"
import { SponsorsCarousel } from "@/components/sponsors-carousel"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const [featuredProducts, newProducts, saleProducts, extrasProducts] = await Promise.all([
    getFeaturedProductsFromDb(),
    getNewProductsFromDb(),
    getSaleProductsFromDb(),
    getProductsByCategoryFromDb("extras"),
  ])

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

      {/* New Products */}
      {newProducts.length > 0 && (
        <ProductCarousel
          title="Novedades"
          subtitle="NUEVOS PRODUCTOS"
          products={newProducts}
          viewAllHref="/category/novedades"
        />
      )}

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

      {/* Associate CTA - ABOVE Sponsors */}
      <section className="py-10 sm:py-14 md:py-28 lg:py-32 bg-gradient-to-b from-background/50 to-muted/20 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-accent to-destructive bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight">
              ¡Convertite en Socio!
            </h2>
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed max-w-2xl md:max-w-4xl mx-auto">
              Y accede a precios exclusivos en indumentaria y accesorios.
            </p>
          </div>

          <Link href="/sponsors/associate" className="inline-block w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                         text-white font-black text-sm sm:text-base md:text-2xl
                         px-4 sm:px-8 md:px-16
                         py-6 sm:py-5 md:py-10
                         shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl
                         rounded-xl sm:rounded-2xl md:rounded-3xl
                         border-2 md:border-4 border-white/30 hover:border-white/50 backdrop-blur-sm
                         transition-all duration-500 cursor-pointer whitespace-normal"
            >
              <span className="text-center leading-snug">
                ¿No sos socio?{" "}
                <span className="inline md:block lg:inline">
                  Asociate ya y accede a los mejores precios
                </span>
              </span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <SponsorsCarousel className="mt-[3rem]" />
    </>
  )
}