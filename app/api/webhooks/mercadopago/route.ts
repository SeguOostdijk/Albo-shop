import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase/admin"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // MP manda varios tipos de notificación (merchant_order, payment, etc.)
    if (body.type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = body?.data?.id
    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    const payment = new Payment(client)
    const mpPayment = await payment.get({ id: paymentId })

    if (mpPayment.status !== "approved") {
      return NextResponse.json({ received: true })
    }

    const orderId = mpPayment.external_reference
    if (!orderId) {
      console.error("Webhook MP: pago aprobado sin external_reference", paymentId)
      return NextResponse.json({ received: true })
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        external_payment_id: String(paymentId),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Webhook MP: error actualizando orden", orderId, error)
    } else {
      console.log(`Webhook MP: orden ${orderId} marcada como pagada`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook MP error:", error)
    // Siempre responder 200 para que MP no reintente indefinidamente
    return NextResponse.json({ received: true })
  }
}
