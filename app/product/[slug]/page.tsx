import { notFound } from "next/navigation"
import { ProductPageClient } from "@/components/product-page-client"
import { getProductBySlugFromDb, getProductsByCategoryFromDb } from "@/lib/products-db"

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

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />
}