import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase/admin"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(request: Request) {
  try {
    const { orderId, formData } = await request.json()

    if (!orderId || !formData?.token) {
      return NextResponse.json(
        { success: false, error: "Datos de pago incompletos" },
        { status: 400 }
      )
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, total, email, first_name, last_name")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado" },
        { status: 404 }
      )
    }

    const payment = new Payment(client)

    const paymentData = {
      transaction_amount: Number(order.total),
      token: formData.token,
      description: `Pedido #${order.id}`,
      installments: Number(formData.installments ?? 1),
      payment_method_id: formData.payment_method_id,
      issuer_id: formData.issuer_id ? Number(formData.issuer_id) : undefined,
      payer: {
        email: order.email,
        identification: formData.payer?.identification ?? undefined,
      },
      external_reference: String(order.id),
    }

    const mpResponse = await payment.create({ body: paymentData })

    const mpStatus = mpResponse.status
    const mpId = mpResponse.id

    let newStatus: string
    if (mpStatus === "approved") {
      newStatus = "paid"
    } else if (mpStatus === "in_process" || mpStatus === "pending") {
      newStatus = "pending"
    } else {
      newStatus = "payment_failed"
    }

    await supabaseAdmin
      .from("orders")
      .update({
        status: newStatus,
        external_payment_id: String(mpId),
      })
      .eq("id", order.id)

    if (mpStatus === "approved") {
      return NextResponse.json({
        success: true,
        status: mpStatus,
        redirectTo: `/account/orders`,
      })
    }

    if (mpStatus === "in_process" || mpStatus === "pending") {
      return NextResponse.json({
        success: true,
        status: mpStatus,
        redirectTo: `/checkout/payment/pending?orderId=${order.id}`,
      })
    }

    return NextResponse.json(
      {
        success: false,
        status: mpStatus,
        error: "El pago fue rechazado. Intentá con otra tarjeta.",
      },
      { status: 422 }
    )
  } catch (error) {
    console.error("Card payment error:", error)
    return NextResponse.json(
      { success: false, error: "Error al procesar el pago" },
      { status: 500 }
    )
  }
}
