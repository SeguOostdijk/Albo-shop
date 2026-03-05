"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Package, Heart, CreditCard, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuthStore } from "@/hooks/use-auth"

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, initialized, signOut, loading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (initialized && !user) {
      router.push("/account/login")
    }
  }, [initialized, user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const accountSections = [
    {
      title: "Mis Datos",
      description: "Actualiza tu información personal",
      icon: User,
      href: "/account/profile",
    },
    {
      title: "Mis Pedidos",
      description: "Historial y seguimiento de compras",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Favoritos",
      description: "Productos guardados",
      icon: Heart,
      href: "/wishlist",
    },
    {
      title: "Métodos de Pago",
      description: "Gestiona tus tarjetas",
      icon: CreditCard,
      href: "/account/payment",
    },
    {
      title: "Configuración",
      description: "Preferencias de cuenta",
      icon: Settings,
      href: "/account/settings",
    },
  ]

  if (!mounted || !initialized || loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Mi Cuenta" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f2f98]"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Mi Cuenta" }]} />

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-[#0f2f98] text-white flex items-center justify-center text-2xl font-bold">
          {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mi Cuenta</h1>
          <p className="text-muted-foreground">{profile?.full_name || user.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accountSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block p-6 border rounded-lg hover:border-[#0f2f98] hover:bg-[#0f2f98]/5 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0f2f98]/10 flex items-center justify-center">
                <section.icon className="h-6 w-6 text-[#0f2f98]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{section.title}</h3>
                <p className="text-muted-foreground text-sm">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 border rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">¿Necesitas ayuda?</h3>
            <p className="text-sm text-muted-foreground">
              Contáctanos por cualquier consulta
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/contact">Contactar</Link>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="destructive" onClick={handleSignOut} className="w-full md:w-auto cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
