import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/type/products"

type DbProductVariant = {
  color: string
  color_hex: string
  sku: string
}

type DbProductStock = {
  size: string
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
  member_price: number | null
  original_price: number | null
  images: string[] | null
  tags: string[] | null
  description: string
  is_featured: boolean | null
  is_new: boolean | null
  is_on_sale: boolean | null
  sale_percentage: number | null
  product_variants?: DbProductVariant[]
  product_stock?: DbProductStock[]
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
    memberPrice: p.member_price ?? undefined,
    originalPrice: p.original_price ?? undefined,
    images: p.images ?? [],
    tags: p.tags ?? [],
    description: p.description,
    isNew: p.is_new ?? undefined,
    isFeatured: p.is_featured ?? undefined,
    isOnSale: p.is_on_sale ?? undefined,
    salePercentage: p.sale_percentage ?? undefined,
    variants: (p.product_variants ?? []).map((v) => ({
      color: v.color,
      colorHex: v.color_hex,
      sku: v.sku,
    })),
    stockBySize: (p.product_stock ?? []).map((s) => ({
      size: s.size,
      stock: Number(s.stock ?? 0),
    })),
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()

  if (q.length < 2) {
    return NextResponse.json({ ok: true, data: [] })
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      category_slug,
      price,
      member_price,
      original_price,
      images,
      tags,
      description,
      is_featured,
      is_new,
      is_on_sale,
      sale_percentage,
      product_variants (
        color,
        color_hex,
        sku
      ),
      product_stock (
        size,
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