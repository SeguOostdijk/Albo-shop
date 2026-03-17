import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Sparkles, Edit3 } from "lucide-react"
import { SponsorsManager } from "@/components/admin/sponsors-manager"

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
    <div className="container mx-auto px-4 py-12 lg:py-20 pb-16 lg:pb-20">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
          <Package className="h-12 w-12" />
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
            Panel de administrador
          </h1>
        </div>
        {/* Removed panel de control and email */}
      </div>

      {/* Productos */}
      <Card className="border-none bg-gradient-to-br from-emerald-50/90 via-white/50 to-green-50/80 backdrop-blur-xl shadow-2xl shadow-emerald-200/50 border border-emerald-200/30 mb-28 hover:shadow-emerald-300/60 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 max-w-6xl mx-auto group">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-700">
              <Package className="h-10 w-10 text-white shadow-lg drop-shadow-md" />
            </div>
          </div>
          <CardTitle className="text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent drop-shadow-lg mb-2">
            PRODUCTOS
          </CardTitle>
          <p className="text-lg text-emerald-700 font-medium tracking-wide opacity-90">
            Gestiona tu catálogo completo
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-6 lg:p-8 items-center justify-center">
            <Link href="/admin/products/new" className="group/button cursor-pointer">
              <Button size="lg" className="w-80 lg:w-96 h-14 lg:h-16 bg-gradient-to-r from-emerald-500/95 to-green-600/95 hover:from-emerald-600/100 hover:to-green-700/100 shadow-xl hover:shadow-emerald-500/25 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.02] text-lg lg:text-xl font-black rounded-2xl border-3 border-emerald-400/50 backdrop-blur-sm transition-all duration-500 cursor-pointer">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
                    <Sparkles className="h-3 w-3 text-white drop-shadow-sm" />
                  </div>
                  + Nuevo Producto
                </span>
              </Button>
            </Link>
            <Link href="/admin/products" className="group/button cursor-pointer">
              <Button variant="outline" size="lg" className="w-80 lg:w-96 h-14 lg:h-16 border-3 border-emerald-500/70 shadow-xl hover:shadow-emerald-400/50 hover:shadow-2xl hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-600/20 text-lg lg:text-xl font-black rounded-2xl border-opacity-80 backdrop-blur-sm hover:border-emerald-600/90 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-md flex items-center justify-center backdrop-blur-sm">
                    <Edit3 className="h-3 w-3 text-emerald-800 drop-shadow-sm" />
                  </div>
                  Editar Productos
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <SponsorsManager />
    </div>
  )
}
