import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("orderId")
    
    if (!orderId) {
      return NextResponse.json({ error: "No orderId" }, { status: 400 })
    }

    // Recreate preference for this order (simplified - in prod use stored preference ID)
    return NextResponse.json({ mpUrl: `/checkout?mp=true&orderId=${orderId}` }, { status: 200 })
  } catch (error) {
    console.error("MP init error:", error)
    return NextResponse.json({ error: "MP init failed" }, { status: 500 })
  }
}

