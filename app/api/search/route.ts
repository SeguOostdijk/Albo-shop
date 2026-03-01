import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/server"
import type { Product } from "@/lib/types/products"

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
    variants: [], // para autocomplete no hace falta cargar variantes (más rápido)
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, data: [] })
  }

  const { data, error } = await supabase
    .from("Product")
    .select("id, slug, name, category, categorySlug, price, originalPrice, images, tags, description, isNew, isFeatured")
    .or(`name.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(8)

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }

  // Filtramos por tags en JS (tags es array y es más simple así)
  const lower = q.toLowerCase()
  const mapped = ((data ?? []) as DbProduct[]).map(mapDbToProduct)
  const filtered = mapped.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
  )

  return NextResponse.json({ ok: true, data: filtered.slice(0, 8) })
}