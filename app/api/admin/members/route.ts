import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isMembershipCurrent } from "@/lib/member-validity";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function checkAdmin() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabaseAdmin
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "admin") return null;
	return user;
}

export async function GET() {
	const user = await checkAdmin();
	if (!user)
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });

	const { data, error } = await supabaseAdmin
		.from("members")
		.select("id, member_name, created_at, is_active")
		.order("member_name", { ascending: true });

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const user = await checkAdmin();
	if (!user)
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });

	const { member_name } = await request.json();

	const { error } = await supabaseAdmin.from("members").insert({
		member_name: member_name.trim(),
		is_active: true,
		last_payment_at: new Date().toISOString(),
	});

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
	const user = await checkAdmin();
	if (!user)
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });

	const { id, is_active, payment_date } = await request.json();

	const updatePayload: { is_active: boolean; last_payment_at?: string } = {
		is_active,
	};
	if (is_active) {
		const today = new Date();
		const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
		const selectedDate = payment_date || todayDate;

		if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
			return NextResponse.json(
				{ error: "Fecha de pago inválida" },
				{ status: 400 },
			);
		}

		if (selectedDate > todayDate) {
			return NextResponse.json(
				{ error: "La fecha de pago no puede ser futura" },
				{ status: 400 },
			);
		}

		const paymentDate = new Date(`${selectedDate}T12:00:00`);

		if (Number.isNaN(paymentDate.getTime())) {
			return NextResponse.json(
				{ error: "Fecha de pago inválida" },
				{ status: 400 },
			);
		}

		if (!isMembershipCurrent(paymentDate.toISOString())) {
			return NextResponse.json(
				{ error: "La fecha de pago ya está vencida" },
				{ status: 400 },
			);
		}

		updatePayload.last_payment_at = paymentDate.toISOString();
	}

	const { error } = await supabaseAdmin
		.from("members")
		.update(updatePayload)
		.eq("id", id);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
	const user = await checkAdmin();
	if (!user)
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });

	const { id } = await request.json();

	const { error } = await supabaseAdmin.from("members").delete().eq("id", id);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({ success: true });
}
