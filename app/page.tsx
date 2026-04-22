export const revalidate = 60

import type { Metadata } from "next"
import { Hero } from "@/components/hero"

export const metadata: Metadata = {
  title: "Indumentaria y Accesorios Oficiales | Albo Shop San Cayetano",
  description:
    "Comprá camisetas, buzos, camperas y accesorios oficiales del Club Atlético Independiente de San Cayetano. Precios exclusivos para socios. Envíos a todo el país.",
  openGraph: {
    title: "Albo Shop | Tienda Oficial Club Atlético Independiente San Cayetano",
    description:
      "Camisetas, indumentaria y accesorios oficiales del club. Precios de socio disponibles. Envíos a todo Argentina.",
    url: "https://alboshop.com.ar",
    images: [
      {
        url: "/Club.jpg",
        width: 1200,
        height: 630,
        alt: "Albo Shop — Tienda Oficial Club Atlético Independiente San Cayetano",
      },
    ],
  },
}
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
      <section className="py-14 sm:py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              ¡Convertite en Socio!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Y accedé a precios exclusivos en indumentaria y accesorios.
            </p>
          </div>

          <Link href="/sponsors/associate" className="inline-block w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90
                         font-black text-sm sm:text-base
                         px-8 sm:px-12
                         py-6
                         shadow-lg hover:shadow-xl
                         rounded-2xl
                         transition-all duration-300 cursor-pointer whitespace-normal"
            >
              <span className="text-center leading-snug">
                ¿No sos socio?{" "}
                <span className="inline sm:block md:inline">
                  Asociate ya y accedé a los mejores precios
                </span>
              </span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <SponsorsCarousel />
    </>
  )
}