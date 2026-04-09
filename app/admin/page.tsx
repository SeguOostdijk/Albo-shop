import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Sparkles, Edit3, ShoppingBag, Users, BarChart3, ShoppingCart, Star } from "lucide-react"

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || profile.role !== "admin") redirect("/")

  return (
    <div className="container mx-auto px-2 sm:px-4 pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Package className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Panel de administrador
          </h1>
        </div>
      </div>

      {/* Card Ingresar Venta */}
      <Card className="border border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-6 group">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Ingresar venta</h2>
                <p className="text-sm text-slate-500">Registrá una venta y descontá stock automáticamente</p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Link href="/admin/sale">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Ingresar venta
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

            {/* Card Productos */}
      <Card className="border border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-6 group">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Productos</h2>
                <p className="text-sm text-slate-500">Gestioná tu catálogo completo</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/admin/products/new" className="flex-1 sm:flex-none">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-300"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Nuevo
                </Button>
              </Link>
              <Link href="/admin/products" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 font-bold rounded-xl transition-all duration-300"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Pedidos */}
      <Card className="border border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-6 group">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Pedidos</h2>
                <p className="text-sm text-slate-500">Revisá el historial de compras</p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Link href="/admin/orders">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-300"
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Ver historial
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Socios */}
      <Card className="border border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-6 group">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Socios</h2>
                <p className="text-sm text-slate-500">Administrá el padrón de socios</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/admin/members" className="flex-1 sm:flex-none">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Ver socios
                </Button>
              </Link>
              <Link href="/admin/members/new" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 font-bold rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Analytics */}
      <Card className="border border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-6 group">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Analytics</h2>
                <p className="text-sm text-slate-500">Ganancias, pedidos y productos más vendidos</p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Link href="/admin/analytics">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Ver analytics
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Sponsors */}
      <Card className="border border-primary/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-6 group">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">Sponsors</h2>
                <p className="text-sm text-slate-500">Administrá los sponsors del club</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/admin/sponsors/new" className="flex-1 sm:flex-none">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Nuevo
                </Button>
              </Link>
              <Link href="/admin/sponsors" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 font-bold rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}