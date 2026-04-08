import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

async function checkAdmin() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "admin") return null
    return user
    }

    export async function GET() {
    const user = await checkAdmin()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { data, error } = await supabaseAdmin
        .from("members")
        .select("id, member_name, created_at, is_active")
        .order("member_name", { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
    }

    export async function POST(request: Request) {
    const user = await checkAdmin()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { member_name } = await request.json()

    const { error } = await supabaseAdmin.from("members").insert({
        member_name: member_name.trim(),
        is_active: true,
        created_at: new Date().toISOString(),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
    }

    export async function PATCH(request: Request) {
    const user = await checkAdmin()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id, is_active } = await request.json()

    const updatePayload: { is_active: boolean; created_at?: string } = { is_active }
    if (is_active) {
        updatePayload.created_at = new Date().toISOString()
    }

    const { error } = await supabaseAdmin
        .from("members")
        .update(updatePayload)
        .eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
    }

    export async function DELETE(request: Request) {
    const user = await checkAdmin()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id } = await request.json()

    const { error } = await supabaseAdmin
        .from("members")
        .delete()
        .eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}