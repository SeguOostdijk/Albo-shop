import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

async function checkAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") return null
  return user
}

export async function PATCH(request: Request) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await request.json()
  console.log("PATCH ORDERS BODY:", body)

  const { id, status, email, firstName, shippingMethod } = body

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)

  console.log("UPDATE ERROR:", error)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  console.log("UPDATE OK, mandando mail...")

  const isDispatched = status === "dispatched"
  const isDelivered = status === "delivered"

  if (isDispatched || isDelivered) {
    const subject = isDispatched
      ? `🚚 Tu pedido #${id} fue despachado — CAI Tienda`
      : `✅ Tu pedido #${id} está listo para retirar — CAI Tienda`

    const message = isDispatched
      ? `Tu pedido está en camino. En los próximos días lo recibirás en tu domicilio.`
      : `Tu pedido está listo para retirar en Av. Rivadavia 4700.`

    await resend.emails.send({
      from: "noreply@alboshop.com.ar",
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="background: #0f2f98; padding: 32px 24px; text-align: center;">
            <img src="https://plkkwwumczomxgnhgeze.supabase.co/storage/v1/object/public/assets/escudo.jpeg" alt="CAI" width="80" height="80" style="border-radius: 8px; margin-bottom: 16px;" />
            <p style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0;">Club Atlético Independiente</p>
            <p style="color: #a5b4fc; font-size: 14px; margin: 4px 0 0;">Tienda Oficial</p>
          </div>
          <div style="padding: 32px 24px;">
            <p style="font-size: 18px; font-weight: bold; color: #1e293b;">Hola, ${firstName}!</p>
            <p style="font-size: 15px; color: #64748b;">${message}</p>
            <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">Pedido #${id}</p>
          </div>
          <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Club Atlético Independiente de San Cayetano — Tienda Oficial</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0;">Consultas: alboshopcai@gmail.com</p>
          </div>
        </div>
      `
    })

    console.log("MAIL ENVIADO")
  }

  return NextResponse.json({ success: true })
}