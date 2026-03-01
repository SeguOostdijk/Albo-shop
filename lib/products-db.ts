import { supabase } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/products" // ajustá el import si tu tipo está en otro lado

type DbProduct = {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  price: number
  originalPrice: number | null
  images: string[]
  tags: string[]
  description: string
  isNew: boolean | null
  isFeatured: boolean | null
  ProductVariant?: Array<{
    color: string
    colorHex: string
    sizes: string[]
    sku: string
    stock: number
  }>
}

function mapDbToProduct(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    categorySlug: p.categorySlug,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    images: p.images ?? [],
    tags: p.tags ?? [],
    description: p.description,
    isNew: p.isNew ?? undefined,
    isFeatured: p.isFeatured ?? undefined,
    variants: (p.ProductVariant ?? []).map((v) => ({
      color: v.color,
      colorHex: v.colorHex,
      sizes: v.sizes ?? [],
      sku: v.sku,
      stockMock: v.stock, // mantenemos tu interfaz actual sin tocar componentes
    })),
  }
}

export async function getAllProductsFromDb(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select(`
      id, slug, name, category, categorySlug, price, originalPrice,
      images, tags, description, isNew, isFeatured,
      ProductVariant ( color, colorHex, sizes, sku, stock )
    `)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}

export async function getFeaturedProductsFromDb(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select(`
      id, slug, name, category, categorySlug, price, originalPrice,
      images, tags, description, isNew, isFeatured,
      ProductVariant ( color, colorHex, sizes, sku, stock )
    `)
    .eq("isFeatured", true)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}

export async function getNewProductsFromDb(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select(`
      id, slug, name, category, categorySlug, price, originalPrice,
      images, tags, description, isNew, isFeatured,
      ProductVariant ( color, colorHex, sizes, sku, stock )
    `)
    .eq("isNew", true)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)

  
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Product")
    .select(`
      id, slug, name, category, categorySlug, price, originalPrice,
      images, tags, description, isNew, isFeatured,
      ProductVariant ( color, colorHex, sizes, sku, stock )
    `)
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  return mapDbToProduct(data as DbProduct)
}

export async function getProductsByCategoryFromDb(categorySlug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select(`
      id, slug, name, category, categorySlug, price, originalPrice,
      images, tags, description, isNew, isFeatured,
      ProductVariant ( color, colorHex, sizes, sku, stock )
    `)
    .eq("categorySlug", categorySlug)

  if (error) throw new Error(error.message)

  return ((data ?? []) as DbProduct[]).map(mapDbToProduct)
}