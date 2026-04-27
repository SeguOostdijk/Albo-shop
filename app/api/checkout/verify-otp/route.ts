import { createHmac } from "crypto"
import { NextRequest, NextResponse } from "next/server"

function generateOtp(email: string, windowOffset = 0): string {
  const secret = process.env.OTP_SECRET ?? "fallback-secret-change-me"
  const window = Math.floor(Date.now() / (10 * 60 * 1000)) - windowOffset
  const hmac = createHmac("sha256", secret)
  hmac.update(`${email.toLowerCase()}:${window}`)
  const hash = hmac.digest("hex")
  const num = parseInt(hash.slice(0, 8), 16)
  return String(num % 1_000_000).padStart(6, "0")
}

export async function POST(req: NextRequest) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Aceptamos ventana actual y la anterior (por si el código fue generado
  // justo antes del cambio de ventana de 10 minutos)
  const current = generateOtp(email, 0)
  const previous = generateOtp(email, 1)

  const valid = code === current || code === previous

  return NextResponse.json({ ok: valid })
}
