"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Heart, User, Settings, LogOut, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuth } from "@/lib/auth-context"

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Mi Cuenta" }]} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Mi Cuenta" }]} />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-3">Mi Cuenta</h1>
            <p className="text-muted-foreground text-lg">Ingresá a tu cuenta o creá una nueva para comenzar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/account/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Ya tengo cuenta</h2>
                    <p className="text-muted-foreground mb-4">Ingresá para ver tus pedidos y gestionar tu cuenta</p>
                    <Button>Iniciar Sesión</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/account/register">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Package className="h-10 w-10 text-accent" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Soy nuevo</h2>
                    <p className="text-muted-foreground mb-4">Creá una cuenta y disfrutá de una experiencia más rápida</p>
                    <Button variant="outline">Crear Cuenta</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">¿Querés comprar sin registrarte?</h3>
                  <p className="text-muted-foreground mb-2">También podés comprar como invitado. Tus pedidos se guardarán con tu email.</p>
                  <Button variant="link" className="px-0" asChild>
                    <Link href="/category/novedades">Ver productos <ChevronRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const menuItems = [
    { title: "Mis Pedidos", desc: "Ver el historial de compras", href: "/account/orders", icon: <Package className="h-6 w-6" />, color: "bg-blue-500" },
    { title: "Mis Favoritos", desc: "Productos guardados", href: "/wishlist", icon: <Heart className="h-6 w-6" />, color: "bg-red-500" },
    { title: "Información de Cuenta", desc: "Actualizar tus datos", href: "/account/profile", icon: <User className="h-6 w-6" />, color: "bg-green-500" },
    { title: "Configuración", desc: "Preferencias y notificaciones", href: "/account/settings", icon: <Settings className="h-6 w-6" />, color: "bg-purple-500" },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Mi Cuenta" }]} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 mb-8 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.user_metadata?.first_name || user.email?.split('@')[0]}</h1>
                <p className="opacity-90">{user.email}</p>
              </div>
            </div>
<Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-red-600 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Gestionar Mi Cuenta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-white`}>{item.icon}</div>
                    <div><h3 className="font-semibold text-lg">{item.title}</h3><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold text-lg">¿Querés seguir comprando?</h3><p className="text-muted-foreground">Explora nuestros productos</p></div>
              <Button asChild><Link href="/category/novedades">Ver Productos <ChevronRight className="h-4 w-4 ml-2" /></Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

