import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabaseServer = await createSupabaseServerClient()
  const { data: { user } } = await supabaseServer.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const body = await req.json()
  const { productId, size, quantity } = body as {
    productId: string
    size: string
    quantity: number
  }

  if (!productId || !size || !quantity || quantity <= 0) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const { data: stockRow, error: fetchError } = await supabaseAdmin
    .from("product_stock")
    .select("id, stock")
    .eq("product_id", productId)
    .eq("size", size)
    .maybeSingle()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  if (!stockRow) return NextResponse.json({ error: "Talle no encontrado para ese producto" }, { status: 404 })

  if (stockRow.stock < quantity) {
    return NextResponse.json(
      { error: `Stock insuficiente. Disponible: ${stockRow.stock}` },
      { status: 400 }
    )
  }

  const { error: updateError } = await supabaseAdmin
    .from("product_stock")
    .update({ stock: stockRow.stock - quantity })
    .eq("id", stockRow.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Fetch product info for analytics record
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id, name, price, images")
    .eq("id", productId)
    .single()

  if (product) {
    const total = product.price * quantity

    const { data: order } = await supabaseAdmin
      .from("orders")
      .insert({
        email: "venta-manual@alboshop.com.ar",
        first_name: "Venta",
        last_name: "Manual",
        address: "-",
        city: "-",
        province: "-",
        postal_code: "-",
        phone: "-",
        shipping_method: "pickup",
        shipping_cost: 0,
        total,
        payment_method: "manual",
        status: "paid",
        shipping_status: "delivered",
      })
      .select("id")
      .single()

    if (order) {
      await supabaseAdmin.from("order_items").insert({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_image: product.images?.[0] ?? null,
        quantity,
        price: product.price,
        color: "-",
        size,
      })
    }
  }

  return NextResponse.json({ ok: true, newStock: stockRow.stock - quantity })
}
