import { createHmac } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { OtpEmail } from "@/lib/email/otp-email"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateOtp(email: string): string {
  const secret = process.env.OTP_SECRET ?? "fallback-secret-change-me"
  const window = Math.floor(Date.now() / (10 * 60 * 1000))
  const hmac = createHmac("sha256", secret)
  hmac.update(`${email.toLowerCase()}:${window}`)
  const hash = hmac.digest("hex")
  const num = parseInt(hash.slice(0, 8), 16)
  return String(num % 1_000_000).padStart(6, "0")
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== "string") {
    return NextResponse.json({ ok: false, error: "Email requerido" }, { status: 400 })
  }

  const code = generateOtp(email)

  const { error } = await resend.emails.send({
    from: "noreply@alboshop.com.ar",
    to: email,
    subject: `${code} es tu código de verificación — Albo Shop`,
    react: OtpEmail({ code }),
  })

  if (error) {
    console.error("Error enviando OTP:", error)
    return NextResponse.json({ ok: false, error: "Error al enviar el email" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
