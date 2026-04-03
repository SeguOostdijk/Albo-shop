import { Resend } from "resend"
import { OrderConfirmationEmail } from "./order-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

type OrderItem = {
  product_name: string
  quantity: number
  price: number
  color: string
  size: string
}

type SendOrderConfirmationProps = {
  to: string
  firstName: string
  orderId: number
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  shippingMethod: string
  paymentMethod: string
}

export async function sendOrderConfirmation({
  to,
  firstName,
  orderId,
  items,
  subtotal,
  shippingCost,
  total,
  shippingMethod,
  paymentMethod,
}: SendOrderConfirmationProps) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: `✅ Pedido #${orderId} confirmado — CAI Tienda`,
    react: OrderConfirmationEmail({
      firstName,
      orderId,
      items,
      subtotal,
      shippingCost,
      total,
      shippingMethod,
      paymentMethod,
    }),
  })

  console.log("RESEND DATA:", data)
  console.log("RESEND ERROR:", error)

  if (error) {
    console.error("Error enviando email:", error)
  }

  return { data, error }
}