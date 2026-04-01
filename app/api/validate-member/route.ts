import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function POST(req: Request) {
  try {
    const { memberName } = await req.json()

    const normalizedMemberName = toTitleCase(String(memberName ?? "")).trim()

    if (!normalizedMemberName) {
      return NextResponse.json(
        { ok: false, valid: false, message: "Nombre de socio inválido" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    const { data: inactiveData, error } = await supabase
      .from("members")
      .select("id, member_name, is_active")
      .eq("member_name", normalizedMemberName)
      .single()

    if (error) {
      console.error("VALIDATE MEMBER ERROR:", error)
      return NextResponse.json(
        { ok: false, valid: false, message: error.message },
        { status: 500 }
      )
    }

    if (!inactiveData) {
      return NextResponse.json({
        ok: true,
        valid: false,
        message: "Nombre de socio inválido",
      })
    }

    if (!inactiveData.is_active) {
      return NextResponse.json({
        ok: true,
        valid: false,
        message: "miembro inactivo. Presione el link de abajo para renovar su suscripción",
      })
    }

    const { data, error: activeError } = await supabase
      .from("members")
      .select("id, member_name, is_active")
      .eq("member_name", normalizedMemberName)
      .eq("is_active", true)
      .single()

    if (activeError) {
      console.error("VALIDATE MEMBER ERROR:", activeError)
      return NextResponse.json(
        { ok: false, valid: false, message: activeError.message },
        { status: 500 }
      )
    }

    console.log("VALIDATE MEMBER INPUT:", normalizedMemberName)
    console.log("VALIDATE MEMBER RESULT:", data)

    if (!data) {
      return NextResponse.json({
        ok: true,
        valid: false,
        message: "Nombre de socio inválido",
      })
    }

    return NextResponse.json({
      ok: true,
      valid: true,
      memberName: data.member_name,
    })
  } catch (error) {
    console.error("VALIDATE MEMBER CATCH:", error)
    return NextResponse.json(
      { ok: false, valid: false, message: "Error al validar nombre de socio" },
      { status: 500 }
    )
  }
}
