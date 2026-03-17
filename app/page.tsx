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
import { PromoBanner } from "@/components/promo-banner"

export default async function HomePage() {
  const [featuredProducts, saleProducts, allProducts] = await Promise.all([
    getFeaturedProductsFromDb(),
    getSaleProductsFromDb(),
    getAllProductsFromDb(),
  ])

  const accessoriesProducts = allProducts.filter(
    (product) => product.categorySlug === "accesorios"
  )

  return (
    <>
      <Hero />

      <CategoryBanner />

      <section className="py-8 md:py-0">
        <ProductCarousel
          title="Destacado"
          subtitle="PRODUCTOS DESTACADOS"
          products={featuredProducts}
          viewAllHref="/category/novedades"
        />
      </section>

      {saleProducts.length > 0 && (
        <section className="py-8 md:py-0">
          <ProductCarousel
            title="Ofertas"
            subtitle="PRODUCTOS EN OFERTA"
            products={saleProducts}
            viewAllHref="/category/oportunidades"
          />
        </section>
      )}

      <section className="bg-muted py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-start gap-3 md:gap-0">
            <div className="mr-1 h-12 w-1 shrink-0 bg-primary md:mr-4 md:h-14" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-primary sm:text-sm">
                EXTRAS
              </p>
              <h2 className="text-xl font-bold uppercase text-accent sm:text-2xl md:text-3xl">
                ACCESORIOS
              </h2>
            </div>
          </div>

          <ProductCarousel
            products={accessoriesProducts}
            viewAllHref="/category/accesorios"
            showDots={false}
          />
        </div>
      </section>

<<<<<<< HEAD
      {/* Espacio publicitario */}
      <PromoBanner 
        imageSrc='/ViaMas.png'
        altText='Oferta especial Albo Shop'
        linkUrl='/promotions'
      />

      {/* Benefits Bar */}
=======
>>>>>>> 2d2a41d4e8399976f4a3e6cea51d06c70e86d8d1
      <BenefitsBar />
    </>
  )
}