import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/auth"

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
      shippingCost,
      total,
      paymentInfo
    } = body

    // Get current user session if logged in
    const { data: { session } } = await supabase.auth.getSession()
    
    const userId = session?.user?.id || null
    const guestEmail = userId ? null : email
    const guestName = userId ? null : `${firstName} ${lastName}`

    // Create shipping address object
    const shippingAddress = {
      firstName,
      lastName,
      address,
      city,
      province,
      postalCode,
      phone
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        guest_email: guestEmail,
        guest_name: guestName,
        status: "pending",
        total: total,
        shipping_cost: shippingCost,
        shipping_method: shippingMethod,
        shipping_address: shippingAddress,
        payment_info: paymentInfo
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

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images?.[0] || null,
      quantity: item.quantity,
      price: item.product.price,
      color: item.selectedColor,
      size: item.selectedSize
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Still return success since order was created
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Pedido procesado exitosamente",
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { success: false, error: "Error al procesar el pedido" },
      { status: 500 }
    )
  }
}
