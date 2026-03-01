import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/server"

export async function GET() {
  const { data, error } = await supabase
    .from("Product")
    .select("id, slug, name, price, category, categorySlug")
    .limit(3)

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message, details: error },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, count: data?.length ?? 0, data })
}