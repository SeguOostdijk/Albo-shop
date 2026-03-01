import { CategoryPageClient } from "@/components/category-page-client"
import { getAllProductsFromDb } from "@/lib/products-db"
import { categories } from "@/lib/types/products"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const allProducts = await getAllProductsFromDb()

  const products =
    slug === "all" ? allProducts : allProducts.filter((p) => p.categorySlug === slug)

  return <CategoryPageClient slug={slug} products={products} categories={categories} />
}