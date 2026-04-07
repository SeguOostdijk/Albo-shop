import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabaseServer = await createSupabaseServerClient()
  const { data: { user } } = await supabaseServer.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at,
      order_items (
        product_id,
        product_name,
        quantity,
        price
      )
    `)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const all = orders ?? []
  const filter = (from: Date) => all.filter((o) => new Date(o.created_at) >= from)
  const revenue = (list: typeof all) => list.reduce((s, o) => s + (o.total ?? 0), 0)
  const avg = (list: typeof all) => (list.length ? revenue(list) / list.length : 0)

  const todayList = filter(startOfDay)
  const weekList = filter(startOfWeek)
  const monthList = filter(startOfMonth)
  const yearList = filter(startOfYear)

  // Aggregate product sales from all orders
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
  all.forEach((order) => {
    ;(order.order_items ?? []).forEach((item: any) => {
      const key = item.product_id as string
      if (!productSales[key]) {
        productSales[key] = { name: item.product_name ?? "—", quantity: 0, revenue: 0 }
      }
      productSales[key].quantity += item.quantity ?? 0
      productSales[key].revenue += (item.price ?? 0) * (item.quantity ?? 0)
    })
  })

  const sorted = Object.values(productSales).sort((a, b) => b.quantity - a.quantity)
  const pendingOrders = all.filter((o) => o.status === "pending").length

  return NextResponse.json({
    revenue: {
      today: revenue(todayList),
      week: revenue(weekList),
      month: revenue(monthList),
      year: revenue(yearList),
      total: revenue(all),
    },
    orders: {
      today: todayList.length,
      week: weekList.length,
      month: monthList.length,
      year: yearList.length,
      total: all.length,
      pending: pendingOrders,
    },
    avgOrderValue: {
      today: avg(todayList),
      week: avg(weekList),
      month: avg(monthList),
      year: avg(yearList),
    },
    topProducts: sorted.slice(0, 5),
    worstProducts: sorted.length > 1 ? [...sorted].slice(-5).reverse() : [],
  })
}
