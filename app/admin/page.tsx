import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Package, BarChart3, ChevronRight } from "lucide-react"
import { SponsorsManager } from "@/components/admin/sponsors-manager"
import { OrdersManager } from "@/components/admin/orders-manager"

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  if (error || !profile || profile.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
          <Package className="h-12 w-12" />
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
            Panel Admin
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Dashboard limpio para gestión de productos y métricas.
        </p>
        <div className="mt-8 text-sm text-muted-foreground font-medium">
          {profile.email}
        </div>
      </div>

      {/* Dashboard Rápido + Métricas */}
      <div className="lg:grid lg:grid-cols-2 gap-8 mb-16">
        {/* Dashboard Rápido */}
        <Card className="border-0 bg-gradient-to-r from-slate-50/80 to-muted/50 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 backdrop-blur-sm border border-primary/10 col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Dashboard Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/products/new">
                <Button size="lg" className="w-full h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl hover:shadow-2xl">
                  + Nuevo Producto
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" size="lg" className="w-full h-14 border-2 border-primary shadow-lg hover:shadow-xl">
                  Ver Productos
                </Button>
              </Link>
            </div>
            <Link href="/admin/orders" className="inline-block text-sm font-semibold text-primary hover:text-primary/90 hover:underline transition-all duration-200">
              Ver órdenes recientes →
            </Link>
          </CardContent>
        </Card>

        {/* Métricas Clave */}
        <Card className="border-0 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 backdrop-blur-sm border border-indigo/20 col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              Métricas Clave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Ingreso 24h</span>
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  $24.800
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Pedidos Hoy</span>
                <span className="text-xl font-bold text-indigo-600">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Conversion</span>
                <span className="text-lg font-bold text-emerald-600">3.8%</span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 w-[68%] rounded-full shadow-inner" />
            </div>
          </CardContent>
        </Card>
      </div>

      <OrdersManager />

      {/* Sponsors Manager */}
      <SponsorsManager />
    </div>
  )
}
