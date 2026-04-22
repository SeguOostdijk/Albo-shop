export const revalidate = 60

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductPageClient } from "@/components/product-page-client"
import { getProductBySlugFromDb, getProductsByCategoryFromDb } from "@/lib/products-db"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlugFromDb(slug)

  if (!product) return {}

  const description = product.description
    ? product.description.slice(0, 155) + (product.description.length > 155 ? "…" : "")
    : `${product.name} — indumentaria oficial del Club Atlético Independiente de San Cayetano.`

  const image = product.images?.[0] ?? "/Club.jpg"

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Albo Shop`,
      description,
      url: `https://alboshop.com.ar/product/${slug}`,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Albo Shop`,
      description,
      images: [image],
    },
  }
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