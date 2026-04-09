import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabaseServer = await createSupabaseServerClient()
    const userResult = await supabaseServer.auth.getUser()

    const user = userResult.data.user
    const userId = user?.id

    if (!userId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        status,
        payment_method,
        total,
        shipping_cost,
        shipping_method,
        created_at,
        order_items (
          id,
          product_id,
          product_name,
          product_image,
          quantity,
          price,
          color,
          size
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al cargar los pedidos.", error)
      return NextResponse.json(
        { error: "Error al cargar los pedidos" },
        { status: 500 }
      )
    }

    const orders = (data ?? []).map((order) => ({
      id: order.id,
      status: order.status,
      shippingStatus: "pending",
      paymentMethod: order.payment_method,
      total: order.total,
      shippingCost: order.shipping_cost,
      shippingMethod: order.shipping_method,
      created_at: order.created_at,
      items: (order.order_items ?? []).map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      })),
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("API /orders unexpected error:", error)

    return NextResponse.json(
      { error: "Error al cargar los pedidos" },
      { status: 500 }
    )
  }
}
