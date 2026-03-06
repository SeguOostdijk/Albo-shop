import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/server"
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()

  if (q.length < 2) {
    return NextResponse.json({ ok: true, data: [] })
  }

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
    .or(`name.ilike.%${q}%,category_slug.ilike.%${q}%`)
    .limit(8)

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    )
  }

  const lower = q.toLowerCase()

  const filtered = ((data ?? []) as DbProduct[])
    .map(mapDbToProduct)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower))
    )
    .slice(0, 8)

  return NextResponse.json({ ok: true, data: filtered })
}