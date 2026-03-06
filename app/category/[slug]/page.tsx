export const revalidate = 60

import { CategoryPageClient } from "@/components/category-page-client"
import { getAllProductsFromDb, getProductsByCategoryFromDb } from "@/lib/products-db"
import { categories } from "@/lib/type/products"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const products =
    slug === "all"
      ? await getAllProductsFromDb()
      : await getProductsByCategoryFromDb(slug)

  return (
    <CategoryPageClient
      slug={slug}
      products={products}
      categories={categories}
    />
  )
}