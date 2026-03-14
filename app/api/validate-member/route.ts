import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { memberNumber } = await req.json()

    const normalizedMemberNumber = String(memberNumber ?? "").trim()

    if (!normalizedMemberNumber) {
      return NextResponse.json(
        { ok: false, valid: false, message: "Número de socio inválido" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("members")
      .select("id, member_number, is_active")
      .eq("member_number", normalizedMemberNumber)
      .eq("is_active", true)
      .maybeSingle()

    if (error) {
      console.error("VALIDATE MEMBER ERROR:", error)
      return NextResponse.json(
        { ok: false, valid: false, message: error.message },
        { status: 500 }
      )
    }

    console.log("VALIDATE MEMBER INPUT:", normalizedMemberNumber)
    console.log("VALIDATE MEMBER RESULT:", data)

    if (!data) {
      return NextResponse.json({
        ok: true,
        valid: false,
        message: "Número de socio inválido",
      })
    }

    return NextResponse.json({
      ok: true,
      valid: true,
      memberNumber: data.member_number,
    })
  } catch (error) {
    console.error("VALIDATE MEMBER CATCH:", error)
    return NextResponse.json(
      { ok: false, valid: false, message: "Error al validar socio" },
      { status: 500 }
    )
  }
}