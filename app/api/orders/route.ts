import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/auth"

export async function GET() {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ orders: [] })
    }

    // Fetch orders for the current user
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json(
        { error: "Error al obtener pedidos" },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

