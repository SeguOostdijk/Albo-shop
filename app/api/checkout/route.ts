import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

type CheckoutItem = {
  quantity: number
  selectedColor: string
  selectedSize: string
  product: {
    id: string
    name: string
    price: number
    memberPrice?: number
    images?: string[]
  }
}

function getShippingCost(subtotal: number, shippingMethod: string) {
  if (shippingMethod === "pickup") return 0
  if (subtotal >= 75000) return 0
  return 1
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("FULL BODY:", JSON.stringify(body, null, 2))

    const {
      items,
      email,
      phone,
      firstName,
      lastName,
      address,
      city,
      province,
      postalCode,
      shippingMethod,
      paymentInfo,
      memberName,
      memberValidated,
    } = body as {
      items: CheckoutItem[]
      email: string
      phone: string
      firstName: string
      lastName: string
      address: string
      city: string
      province: string
      postalCode: string
      shippingMethod: "pickup" | "standard" | "express"
      shippingCost: number
      total: number
      paymentInfo: {
        method: string
        last4?: string
        brand?: string
        cardName?: string
        dni?: string
      }
      memberName?: string | null
      memberValidated?: boolean
    }

    console.log("CHECKOUT BODY:", {
      email,
      phone,
      firstName,
      lastName,
      address,
      city,
      province,
      postalCode,
      shippingMethod,
      memberName,
      memberValidated,
      itemsCount: items?.length,
    })
    console.log("Payment method:", paymentInfo.method)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "El carrito está vacío" },
        { status: 400 }
      )
    }

    if (
      !email ||
      !phone ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !province ||
      !postalCode
    ) {
      return NextResponse.json(
        { success: false, error: "Faltan datos obligatorios" },
        { status: 400 }
      )
    }

    const supabaseServer = await createSupabaseServerClient()
    const userResult = await supabaseServer.auth.getUser()

    console.log("CHECKOUT AUTH USER:", userResult.data.user)
    console.log("CHECKOUT AUTH ERROR:", userResult.error)

    const userId = userResult.data.user?.id ?? null

    console.log("USER ID TO INSERT:", userId)

    let validMember = false

    if (memberValidated && memberName?.trim()) {
      const { data: memberData, error: memberError } = await supabaseAdmin
        .from("members")
        .select("id, member_number")
        .eq("member_number", memberName.trim())
        .eq("is_active", true)
        .maybeSingle()

      if (memberError) {
        console.error("Error validating member:", memberError)
        return NextResponse.json(
          { success: false, error: "No se pudo validar el número de socio" },
          { status: 500 }
        )
      }

      validMember = !!memberData
    }

    const productIds = [...new Set(items.map((item) => item.product.id))]

    const { data: productsData, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, member_price, images")
      .in("id", productIds)

    if (productsError) {
      console.error("Error loading products:", productsError)
      return NextResponse.json(
        { success: false, error: "No se pudieron validar los productos" },
        { status: 500 }
      )
    }

    const { data: stockData, error: stockError } = await supabaseAdmin
      .from("product_stock")
      .select("product_id, size, stock")
      .in("product_id", productIds)

    if (stockError) {
      console.error("Error loading stock:", stockError)
      return NextResponse.json(
        { success: false, error: "No se pudo validar el stock" },
        { status: 500 }
      )
    }

    const productsMap = new Map((productsData ?? []).map((p) => [p.id, p]))

    const stockMap = new Map<string, number>()
    for (const row of stockData ?? []) {
      const key = `${row.product_id}__${row.size}`
      stockMap.set(key, Number(row.stock ?? 0))
    }

    let subtotal = 0

    const validatedOrderItems = items.map((item) => {
      const dbProduct = productsMap.get(item.product.id)

      if (!dbProduct) {
        throw new Error(`El producto "${item.product.name}" ya no existe.`)
      }

      const stockKey = `${item.product.id}__${item.selectedSize}`
      const availableStock = stockMap.get(stockKey)

      if (availableStock === undefined) {
        throw new Error(
          `El talle ${item.selectedSize} no está disponible para "${dbProduct.name}".`
        )
      }

      if (availableStock < item.quantity) {
        throw new Error(
          `No hay stock suficiente para "${dbProduct.name}" talle ${item.selectedSize}.`
        )
      }

      const unitPrice =
        validMember && dbProduct.member_price
          ? dbProduct.member_price
          : dbProduct.price

      subtotal += unitPrice * item.quantity

      return {
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        product_image: dbProduct.images?.[0] || null,
        quantity: item.quantity,
        price: unitPrice,
        color: item.selectedColor,
        size: item.selectedSize,
      }
    })

    const shippingCost = getShippingCost(subtotal, shippingMethod)
    const total = subtotal + shippingCost

    // === MERCADOPAGO: guardar sesión y crear preference — sin crear orden ===
    if (paymentInfo.method === "mercadopago") {
      const { data: session, error: sessionError } = await supabaseAdmin
        .from("checkout_sessions")
        .insert({
          user_id: userId,
          session_data: {
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
            memberName: validMember ? memberName?.trim() : null,
            validatedOrderItems,
            paymentInfo,
          },
        })
        .select("id")
        .single()

      if (sessionError) {
        console.error("Error creando checkout_session:", sessionError)
        return NextResponse.json(
          { success: false, error: "Error al iniciar el pago" },
          { status: 500 }
        )
      }

      const baseUrl = process.env.NEXT_PUBLIC_URL || ""
      const isLocalhost = !baseUrl || baseUrl.includes("localhost")

      const preference = {
        items: validatedOrderItems.map((item) => ({
          id: item.product_id,
          title: item.product_name,
          currency_id: "ARS",
          picture_url: item.product_image || "https://via.placeholder.com/300",
          description: `${item.color} / ${item.size}`,
          category_id: "products",
          quantity: item.quantity,
          unit_price: item.price,
        })),
        payer: {
          name: firstName,
          surname: lastName,
          email,
          phone: { area_code: phone.slice(1, 4), number: phone.slice(4) },
          identification: { type: "DNI", number: "" },
          address: { street_name: address, zip_code: postalCode },
        },
        back_urls: {
          success: `${baseUrl}/account/orders`,
          failure: `${baseUrl}/checkout?error=pago-fallo`,
          pending: `${baseUrl}/checkout?info=pago-pendiente`,
        },
        ...(!isLocalhost && { auto_return: "approved" as "approved" }),
        ...(!isLocalhost && {
          notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        }),
        external_reference: session.id,
        payment_methods: {
          excluded_payment_methods: [],
          installments: 12,
        },
        shipments: {
          cost: shippingCost,
          mode: "not_specified",
        },
      }

      const mpPreference = new Preference(client)
      const response = await mpPreference.create({ body: preference })

      await supabaseAdmin
        .from("checkout_sessions")
        .update({ mp_preference_id: response.id })
        .eq("id", session.id)

      return NextResponse.json({
        success: true,
        mpUrl: response.init_point,
        message: "Redirigiendo a MercadoPago...",
      })
    }

    const insertPayload = {
      user_id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      address,
      city,
      province,
      postal_code: postalCode,
      shipping_method: shippingMethod,
      shipping_cost: shippingCost,
      total,
      payment_method: paymentInfo.method,
      payment_info: {
        ...paymentInfo,
        memberApplied: validMember,
        memberName: validMember ? memberName?.trim() : null,
      },
      member_number: validMember ? memberName?.trim() : null,
      member_validated: validMember,
      status: (paymentInfo.method === "credit-card" || paymentInfo.method === "debit-card") ? "paid" : "pending",
      phone,
    }

    console.log("INSERT PAYLOAD:", insertPayload)

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(insertPayload)
      .select("id, user_id, email, created_at")
      .single()

    console.log("ORDER CREATED:", order)
    console.log("ORDER ERROR:", orderError)

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json(
        { success: false, error: "Error al crear el pedido" },
        { status: 500 }
      )
    }

    const orderItems = validatedOrderItems.map((item) => ({
      order_id: order.id,
      ...item,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      await supabaseAdmin.from("orders").delete().eq("id", order.id)
      return NextResponse.json(
        { success: false, error: "Error al guardar los productos del pedido" },
        { status: 500 }
      )
    }

    // Descontar stock
    for (const item of validatedOrderItems) {
      const currentStock = stockMap.get(`${item.product_id}__${item.size}`)!
      await supabaseAdmin
        .from("product_stock")
        .update({ stock: currentStock - item.quantity })
        .eq("product_id", item.product_id)
        .eq("size", item.size)
    }

    // Enviar email de confirmación
    try {
      if (paymentInfo.method === "transfer") {
        await resend.emails.send({
          from: "noreply@alboshop.com.ar",
          to: email,
          subject: `📋 Pedido #${order.id} recibido — CAI Tienda`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="background: #0f2f98; padding: 32px 24px; text-align: center;">
                <img src="https://alboshop.com.ar/escudo.jpeg" alt="CAI" width="80" height="80" style="border-radius: 8px; margin-bottom: 16px;" />
                <p style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0;">Club Atlético Independiente</p>
                <p style="color: #a5b4fc; font-size: 14px; margin: 4px 0 0;">Tienda Oficial</p>
              </div>
              <div style="padding: 32px 24px;">
                <p style="font-size: 18px; font-weight: bold; color: #1e293b;">Hola, ${firstName}!</p>
                <p style="font-size: 15px; color: #64748b;">Recibimos tu pedido <strong>#${order.id}</strong>. Aguardamos tu transferencia para confirmarlo.</p>
                <p style="font-size: 15px; color: #64748b; margin-top: 12px;">Una vez realizada la transferencia, enviá el comprobante a <strong>alboshopcai@gmail.com</strong> indicando tu número de pedido.</p>
                <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <p style="font-size: 13px; color: #64748b; margin: 0 0 8px;"><strong>Datos bancarios:</strong></p>
                  <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Banco: Banco de la Nación Argentina</p>
                  <p style="font-size: 13px; color: #64748b; margin: 4px 0;">CBU: 0110464040046411693330</p>
                  <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Alias: ALBO.SHOP</p>
                  <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Nombre: Club Atlético Independiente de San Cayetano</p>
                </div>
              </div>
              <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">Club Atlético Independiente de San Cayetano — Tienda Oficial</p>
                <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0;">Consultas: alboshopcai@gmail.com</p>
              </div>
            </div>
          `,
        })
      } else {
        await sendOrderConfirmation({
          to: email,
          firstName,
          orderId: order.id,
          items: validatedOrderItems.map(item => ({
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
          subtotal,
          shippingCost,
          total,
          shippingMethod,
          paymentMethod: paymentInfo.method,
        })
      }
    } catch (emailError) {
      console.error("Error enviando email de confirmación:", emailError)
    }

    // Notificación interna al admin
    try {
      const shippingLabels: Record<string, string> = {
        pickup: "Retiro en local",
        standard: "Envío estándar",
        express: "Envío express",
      }
      const paymentLabels: Record<string, string> = {
        transfer: "Transferencia bancaria",
        mercadopago: "MercadoPago",
        "credit-card": "Tarjeta de crédito",
        "debit-card": "Tarjeta de débito",
      }

      const itemsRows = validatedOrderItems.map(item => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${item.product_name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${item.color}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${item.size}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; text-align: right;">$${item.price.toLocaleString("es-AR")}</td>
        </tr>
      `).join("")

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
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${paymentLabels[paymentInfo.method] ?? paymentInfo.method}</td>
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
      console.error("Error enviando notificación al admin:", adminEmailError)
    }

    let redirectTo = "/account/orders"

    if (paymentInfo.method === "transfer") {
      redirectTo = `/checkout/payment/transfer?orderId=${order.id}`
    } else if (
      paymentInfo.method === "credit-card" ||
      paymentInfo.method === "debit-card"
    ) {
      redirectTo = `/checkout/payment/card?orderId=${order.id}&type=${paymentInfo.method}`
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      subtotal,
      shippingCost,
      total,
      memberApplied: validMember,
      redirectTo,
      message: "Pedido procesado exitosamente",
    })
  } catch (error) {
    console.error("Checkout error:", error)

    const message =
      error instanceof Error
        ? error.message
        : "Error al procesar el pedido"

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}