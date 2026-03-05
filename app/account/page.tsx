"use client"

import Link from "next/link"
import { User, Package, Heart, CreditCard, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function AccountPage() {
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

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Mi Cuenta" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Mi Cuenta</h1>

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
        <Button variant="destructive" className="w-full md:w-auto">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
