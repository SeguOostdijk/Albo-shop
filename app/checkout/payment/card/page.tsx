import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { CardPaymentBrick } from "./CardPaymentBrick"

interface CardPageProps {
  searchParams: Promise<{ orderId?: string; type?: string }>
}

export default async function CardPage({ searchParams }: CardPageProps) {
  const { orderId, type } = await searchParams

  if (!orderId) redirect("/")

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, total, email, first_name, payment_method")
    .eq("id", orderId)
    .single()

  if (error || !order) redirect("/")

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
  if (!publicKey) redirect("/")

  const paymentType =
    type === "debit-card" || order.payment_method === "debit-card"
      ? "debit-card"
      : "credit-card"

  const label = paymentType === "debit-card" ? "débito" : "crédito"

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Pago con tarjeta de {label}</h1>
      <p className="text-muted-foreground mb-8">
        Pedido <strong>#{order.id}</strong> · Total:{" "}
        <strong>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(order.total)}
        </strong>
      </p>

      <div className="rounded-lg border p-6">
        <CardPaymentBrick
          orderId={String(order.id)}
          amount={order.total}
          email={order.email}
          paymentType={paymentType}
          publicKey={publicKey}
        />
      </div>
    </div>
  )
}
