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
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

      {/* Associate CTA - ABOVE Sponsors */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background/50 to-muted/20 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-accent to-destructive bg-clip-text text-transparent mb-8 tracking-tight">
              ¡Convertite en Socio!
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed">
              Y accede a precios exclusivos en indumentaria y accesorios.
            </p>
          </div>
          <Link href="/sponsors/associate" className="inline-block group">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                         text-white font-black text-xl md:text-2xl px-16 py-10 shadow-2xl hover:shadow-3xl 
                         rounded-3xl border-4 border-white/30 hover:border-white/50 backdrop-blur-sm
                         hover:scale-[1.05] transition-all duration-500 group-hover:shadow-green-500/25 cursor-pointer"
            >
              ¿No sos socio? <span className="block sm:inline md:block lg:inline">Asociate ya y accede a los mejores precios</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <SponsorsCarousel 
        className="mt-[3rem]"
      />

      {/* Benefits Bar */}
      <BenefitsBar />
    </>
  )
}
