import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/auth"

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

    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session

    const userId = session?.user?.id || null
    const guestEmail = userId ? null : email
    const guestName = userId ? null : `${firstName} ${lastName}`

    let validMember = false

    if (memberValidated && memberNumber?.trim()) {
      const { data: memberData, error: memberError } = await supabase
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

    const { data: productsData, error: productsError } = await supabase
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

    const { data: stockData, error: stockError } = await supabase
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

    const productsMap = new Map(
      (productsData ?? []).map((p) => [p.id, p])
    )

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
          `No hay stock suficiente para "${dbProduct.name}" talle ${item.selectedSize}".`
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

    const shippingAddress = {
      firstName,
      lastName,
      address,
      city,
      province,
      postalCode,
      phone,
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        guest_email: guestEmail,
        guest_name: guestName,
        status: "pending",
        total,
        shipping_cost: shippingCost,
        shipping_method: shippingMethod,
        shipping_address: shippingAddress,
        payment_info: {
          ...paymentInfo,
          memberApplied: validMember,
          memberNumber: validMember ? memberNumber?.trim() : null,
        },
      })
      .select()
      .single()

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

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      return NextResponse.json(
        { success: false, error: "Error al guardar los productos del pedido" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      subtotal,
      shippingCost,
      total,
      memberApplied: validMember,
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