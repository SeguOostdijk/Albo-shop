import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("orderId")
    
    if (!orderId) {
      return NextResponse.json({ error: "No orderId" }, { status: 400 })
    }

    // Recreate preference for this order (simplified - in prod use stored preference ID)
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Rebuild preference from order data (logic same as checkout)
    const preference = {
      items: order.order_items.map((item: any) => ({
        id: item.product_id,
        title: item.product_name,
        currency_id: "ARS",
        picture_url: item.product_image || "https://via.placeholder.com/300",
        description: `${item.color} / ${item.size}`,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      payer: {
        name: order.first_name,
        surname: order.last_name,
        email: order.email,
      },
      back_urls: {
        success: "http://localhost:3000/account/orders",
        failure: "http://localhost:3000/checkout?error=pago-fallo",
        pending: `http://localhost:3000/checkout/payment/pending?orderId=${orderId}`
      },
      auto_return: "approved",
      external_reference: order.id.toString(),
    }

    const mpPreference = new Preference(client)
    const response = await mpPreference.create({ body: preference })

    return NextResponse.json({ mpUrl: response.init_point })
  } catch (error) {
    console.error("MP init error:", error)
    return NextResponse.json({ error: "MP init failed" }, { status: 500 })
  }
}

