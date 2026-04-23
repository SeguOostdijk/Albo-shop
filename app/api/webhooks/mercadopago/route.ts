import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation"
import { Resend } from "resend"
import { createHmac } from "crypto"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const resend = new Resend(process.env.RESEND_API_KEY)

const shippingLabels: Record<string, string> = {
  pickup: "Retiro en local",
  standard: "Envío estándar",
  express: "Envío express",
}

function verifyMPSignature(headers: Headers, paymentId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) {
    console.warn("Webhook MP: MERCADOPAGO_WEBHOOK_SECRET no configurado, saltando verificación")
    return true
  }

  const xSignature = headers.get("x-signature")
  const xRequestId = headers.get("x-request-id")

  if (!xSignature || !xRequestId) {
    console.error("Webhook MP: headers de firma ausentes")
    return false
  }

  let ts: string | undefined
  let v1: string | undefined

  for (const part of xSignature.split(",")) {
    const [key, value] = part.trim().split("=")
    if (key === "ts") ts = value
    if (key === "v1") v1 = value
  }

  if (!ts || !v1) {
    console.error("Webhook MP: x-signature mal formado:", xSignature)
    return false
  }

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`
  const hash = createHmac("sha256", secret).update(manifest).digest("hex")

  return hash === v1
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = body?.data?.id
    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    if (!verifyMPSignature(request.headers, String(paymentId))) {
      console.error("Webhook MP: firma inválida para payment", paymentId)
      return NextResponse.json({ received: true })
    }

    const payment = new Payment(client)
    const mpPayment = await payment.get({ id: paymentId })

    if (mpPayment.status !== "approved") {
      return NextResponse.json({ received: true })
    }

    const sessionId = mpPayment.external_reference
    if (!sessionId) {
      console.error("Webhook MP: pago aprobado sin external_reference", paymentId)
      return NextResponse.json({ received: true })
    }

    // Marcar la sesión como usada atómicamente (idempotencia)
    const { data: session } = await supabaseAdmin
      .from("checkout_sessions")
      .update({ used: true })
      .eq("id", sessionId)
      .eq("used", false)
      .select("session_data, user_id")
      .single()

    if (!session) {
      console.log(`Webhook MP: sesión ${sessionId} ya procesada o no existe`)
      return NextResponse.json({ received: true })
    }

    const {
      email,
      phone,
      firstName,
      lastName,
      address,
      city,
      province,
      postalCode,
      shippingMethod,
      shippingCost,
      subtotal,
      total,
      validMember,
      memberName,
      validatedOrderItems,
      paymentInfo,
    } = session.session_data

    // Crear la orden
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: session.user_id,
        email,
        phone,
        first_name: firstName,
        last_name: lastName,
        address,
        city,
        province,
        postal_code: postalCode,
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
        total,
        payment_method: "mercadopago",
        payment_info: {
          ...paymentInfo,
          memberApplied: validMember,
          memberName: validMember ? memberName : null,
        },
        member_number: validMember ? memberName : null,
        member_validated: validMember,
        status: "paid",
        external_payment_id: String(paymentId),
      })
      .select("id")
      .single()

    if (orderError || !order) {
      console.error("Webhook MP: error creando orden", orderError)
      return NextResponse.json({ received: true })
    }

    // Crear items de la orden
    const orderItems = validatedOrderItems.map((item: Record<string, unknown>) => ({
      order_id: order.id,
      ...item,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Webhook MP: error creando order_items", itemsError)
      await supabaseAdmin.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ received: true })
    }

    // Descontar stock
    for (const item of validatedOrderItems) {
      const { data: stockRow } = await supabaseAdmin
        .from("product_stock")
        .select("stock")
        .eq("product_id", item.product_id)
        .eq("size", item.size)
        .single()

      if (stockRow) {
        await supabaseAdmin
          .from("product_stock")
          .update({ stock: Math.max(0, stockRow.stock - item.quantity) })
          .eq("product_id", item.product_id)
          .eq("size", item.size)
      }
    }

    // Email de confirmación al comprador
    try {
      await sendOrderConfirmation({
        to: email,
        firstName,
        orderId: order.id,
        items: validatedOrderItems.map((item: Record<string, unknown>) => ({
          product_name: item.product_name as string,
          quantity: item.quantity as number,
          price: item.price as number,
          color: item.color as string,
          size: item.size as string,
        })),
        subtotal,
        shippingCost,
        total,
        shippingMethod,
        paymentMethod: "mercadopago",
      })
    } catch (emailError) {
      console.error("Webhook MP: error enviando email de confirmación", emailError)
    }

    // Notificación al admin
    try {
      const itemsRows = validatedOrderItems
        .map(
          (item: Record<string, unknown>) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${item.product_name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${item.color}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${item.size}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: right;">$${(item.price as number).toLocaleString("es-AR")}</td>
        </tr>
      `
        )
        .join("")

      await resend.emails.send({
        from: "noreply@alboshop.com.ar",
        to: "alboshopcai@gmail.com",
        subject: `🛒 Nuevo pedido #${order.id} — ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="background: #0f2f98; padding: 32px 24px; text-align: center;">
              <img src="https://alboshop.com.ar/escudo.jpeg" alt="CAI" width="80" height="80" style="border-radius: 8px; margin-bottom: 16px;" />
              <p style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0;">Nuevo Pedido Recibido</p>
              <p style="color: #a5b4fc; font-size: 14px; margin: 4px 0 0;">Pedido #${order.id}</p>
            </div>
            <div style="padding: 32px 24px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Comprador</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: bold;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Método de envío</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${shippingLabels[shippingMethod] ?? shippingMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Método de pago</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">MercadoPago</td>
                </tr>
              </table>

              <p style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">Productos:</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="padding: 10px 12px; text-align: left; color: #64748b; font-weight: 600;">Producto</th>
                    <th style="padding: 10px 12px; text-align: left; color: #64748b; font-weight: 600;">Color</th>
                    <th style="padding: 10px 12px; text-align: left; color: #64748b; font-weight: 600;">Talle</th>
                    <th style="padding: 10px 12px; text-align: center; color: #64748b; font-weight: 600;">Cant.</th>
                    <th style="padding: 10px 12px; text-align: right; color: #64748b; font-weight: 600;">Precio</th>
                  </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
              </table>

              <div style="background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 14px; color: #64748b;">Subtotal</span>
                  <span style="font-size: 14px; color: #1e293b;">$${subtotal.toLocaleString("es-AR")}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 14px; color: #64748b;">Envío</span>
                  <span style="font-size: 14px; color: #1e293b;">${shippingCost === 0 ? "Gratis" : "$" + shippingCost.toLocaleString("es-AR")}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 6px;">
                  <span style="font-size: 15px; font-weight: bold; color: #1e293b;">Total</span>
                  <span style="font-size: 15px; font-weight: bold; color: #0f2f98;">$${total.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>
            <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Club Atlético Independiente de San Cayetano — Tienda Oficial</p>
            </div>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Webhook MP: error enviando notificación al admin", adminEmailError)
    }

    console.log(`Webhook MP: orden ${order.id} creada correctamente`)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook MP error:", error)
    return NextResponse.json({ received: true })
  }
}
