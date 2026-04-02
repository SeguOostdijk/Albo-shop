import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

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
  if (shippingMethod === "express") return 9999
  if (subtotal >= 75000) return 0
  return 5999
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
      memberNumber,
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
      memberNumber?: string | null
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
      memberNumber,
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

    if (memberValidated && memberNumber?.trim()) {
      const { data: memberData, error: memberError } = await supabaseAdmin
        .from("members")
        .select("id, member_number")
        .eq("member_number", memberNumber.trim())
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
        memberNumber: validMember ? memberNumber?.trim() : null,
      },
      member_number: validMember ? memberNumber?.trim() : null,
      member_validated: validMember,
      status: "pending",
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

    console.log(`Stock skip for MP order ${order.id}`)

    let redirectTo = "/account/orders"

    if (paymentInfo.method === "transfer") {
      redirectTo = `/checkout/payment/transfer?orderId=${order.id}`
    } else if (
      paymentInfo.method === "credit-card" ||
      paymentInfo.method === "debit-card"
    ) {
      redirectTo = `/checkout/payment/card?orderId=${order.id}`
    } else if (paymentInfo.method === "mercadopago") {
      const baseUrl = process.env.NEXT_PUBLIC_URL || ""
      const isLocalhost = !baseUrl || baseUrl.includes("localhost")

      console.log("BASE URL:", baseUrl)
      console.log("IS LOCALHOST:", isLocalhost)

      const preference = {
        items: validatedOrderItems.map(item => ({
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
          address: { street_name: address, zip_code: postalCode }
        },
        back_urls: {
          success: `${baseUrl}/account/orders`,
          failure: `${baseUrl}/checkout?error=pago-fallo`,
          pending: `${baseUrl}/checkout/payment/pending?orderId=${order.id}`
        },
        // auto_return solo funciona con URLs públicas, no con localhost
        ...(!isLocalhost && { auto_return: "approved" as "approved" }),
        // notification_url tampoco funciona en localhost
        ...(!isLocalhost && {
          notification_url: `${baseUrl}/api/webhooks/mercadopago`
        }),
        external_reference: order.id.toString(),
        payment_methods: {
          excluded_payment_methods: [],
          installments: 12
        },
        shipments: {
          cost: shippingCost,
          mode: "not_specified"
        }
      }

      console.log("PREFERENCE BODY:", JSON.stringify(preference, null, 2))

      const mpPreference = new Preference(client)
      const response = await mpPreference.create({ body: preference })
      const mpUrl = response.init_point

      await supabaseAdmin
        .from("orders")
        .update({ external_payment_id: response.id })
        .eq("id", order.id)

      return NextResponse.json({
        success: true,
        orderId: order.id,
        mpUrl,
        message: "Redirigiendo a MercadoPago..."
      })
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