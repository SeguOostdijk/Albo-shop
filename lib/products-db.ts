import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/type/products"

type DbProductVariant = {
  color: string
  color_hex: string
  sizes: string[]
  sku: string
  stock: number
}

type DbCategory = {
  slug: string
  name: string
}

type DbProduct = {
  id: string
  slug: string
  name: string
  category_slug: string
  price: number
  original_price: number | null
  images: string[] | null
  tags: string[] | null
  description: string
  is_featured: boolean | null
  is_new: boolean | null
  product_variants?: DbProductVariant[]
  categories?: DbCategory | DbCategory[] | null
}

function mapDbToProduct(p: DbProduct): Product {
  const categoryData = Array.isArray(p.categories) ? p.categories[0] : p.categories

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: categoryData?.name ?? p.category_slug,
    categorySlug: p.category_slug,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    images: p.images ?? [],
    tags: p.tags ?? [],
    description: p.description,
    isNew: p.is_new ?? undefined,
    isFeatured: p.is_featured ?? undefined,
    variants: (p.product_variants ?? []).map((v) => ({
      color: v.color,
      colorHex: v.color_hex,
      sizes: v.sizes ?? [],
      sku: v.sku,
      stockMock: v.stock,
    })),
  }
}

export async function getAllProductsFromDb(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      category_slug,
      price,
      original_price,
      images,
      tags,
      description,
      is_featured,
      is_new,
      product_variants (
        color,
        color_hex,
        sizes,
        sku,
        stock
      ),
      categories!products_category_slug_fkey (
        slug,
        name
      )
    `)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}

export async function getFeaturedProductsFromDb(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      category_slug,
      price,
      original_price,
      images,
      tags,
      description,
      is_featured,
      is_new,
      product_variants (
        color,
        color_hex,
        sizes,
        sku,
        stock
      ),
      categories!products_category_slug_fkey (
        slug,
        name
      )
    `)
    .eq("is_featured", true)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}

export async function getNewProductsFromDb(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      category_slug,
      price,
      original_price,
      images,
      tags,
      description,
      is_featured,
      is_new,
      product_variants (
        color,
        color_hex,
        sizes,
        sku,
        stock
      ),
      categories!products_category_slug_fkey (
        slug,
        name
      )
    `)
    .eq("is_new", true)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      category_slug,
      price,
      original_price,
      images,
      tags,
      description,
      is_featured,
      is_new,
      product_variants (
        color,
        color_hex,
        sizes,
        sku,
        stock
      ),
      categories!products_category_slug_fkey (
        slug,
        name
      )
    `)
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  return mapDbToProduct(data as DbProduct)
}

export async function getProductsByCategoryFromDb(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      category_slug,
      price,
      original_price,
      images,
      tags,
      description,
      is_featured,
      is_new,
      product_variants (
        color,
        color_hex,
        sizes,
        sku,
        stock
      ),
      categories!products_category_slug_fkey (
        slug,
        name
      )
    `)
    .eq("category_slug", categorySlug)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}