import { NextResponse } from "next/server"
import { toast } from "sonner"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Por favor ingresa un email válido" },
        { status: 400 }
      )
    }

    // Here you would typically save to a database or send to a service like Mailchimp
    // For now, we'll just simulate a successful subscription
    console.log("Newsletter subscription:", email)

    return NextResponse.json(
      { message: "Te suscribiste correctamente al newsletter" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Newsletter error:", error)
    return NextResponse.json(
      { error: "Error al procesar la suscripción" },
      { status: 500 }
    )
  }
}

