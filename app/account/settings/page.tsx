"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Settings, Bell, Shield, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"


export default function SettingsPage() {
  const { user, loading, deleteAccount } = useAuth()
  const router = useRouter()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Mi Cuenta", href: "/account" },
            { label: "Configuración" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/account/login")
    return null
  }


  const handleSaveNotifications = () => {
    toast.success("Preferencias guardadas correctamente")
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")
    
    if (!confirmed) return

    setIsDeleting(true)

    try {
      const { error } = await deleteAccount()

      if (error) {
        toast.error("Error al eliminar la cuenta")
      } else {
        toast.success("Cuenta eliminada correctamente")
        router.push("/")
        router.refresh()
      }
    } catch {
      toast.error("Error al eliminar la cuenta")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Mi Cuenta", href: "/account" },
          { label: "Configuración" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8 text-center">Configuración</h1>

      <div className="max-w-2xl mx-auto space-y-6 text-center">
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription className="text-center">
              Configura cómo quieres recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones por email</p>
                <p className="text-sm text-muted-foreground">Recibe actualizaciones sobre tus pedidos</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${emailNotifications ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones por SMS</p>
                <p className="text-sm text-muted-foreground">Recibe mensajes de texto sobre tus pedidos</p>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${smsNotifications ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emails de marketing</p>
                <p className="text-sm text-muted-foreground">Recibe ofertas y promociones especiales</p>
              </div>
              <button
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${marketingEmails ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <Button onClick={handleSaveNotifications} className="w-full mt-4 cursor-pointer">
              Guardar Preferencias
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidad y Seguridad
            </CardTitle>
            <CardDescription className="text-center">
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Eliminar cuenta</p>
                <p className="text-sm text-muted-foreground">Borra todos tus datos de forma permanente</p>
              </div>
              <Button variant="destructive" size="sm" className="cursor-pointer" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Ayuda
            </CardTitle>
            <CardDescription className="text-center">
              ¿Necesitas ayuda con tu cuenta?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <a href="/help/faq">Preguntas Frecuentes</a>
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <a href="/contact">Contactanos</a>
            </Button>
            <Button variant="outline" className="w-full justify-start cursor-pointer" asChild>
              <a href="/policies/returns">Política de Devoluciones</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

