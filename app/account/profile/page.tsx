"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User, Mail, Phone, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user, loading, updateProfile, updatePassword } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      })

      if (error) {
        toast.error("Error al actualizar el perfil")
      } else {
        toast.success("Perfil actualizado correctamente")
        router.refresh()
      }
    } catch {
      toast.error("Error al actualizar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsChangingPassword(true)

    try {
      const { error } = await updatePassword(passwordData.newPassword)

      if (error) {
        toast.error("Error al cambiar la contraseña")
      } else {
        toast.success("Contraseña actualizada correctamente")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch {
      toast.error("Error al cambiar la contraseña")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Mi Cuenta", href: "/account" },
            { label: "Información de Cuenta" },
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

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Mi Cuenta", href: "/account" },
          { label: "Información de Cuenta" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8 text-center">Información de Cuenta</h1>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              Datos Personales
            </CardTitle>
            <CardDescription className="text-center">
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 11 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full cursor-pointer">
                {isSaving ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription className="text-center">
              Actualiza tu contraseña de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={isChangingPassword} className="w-full cursor-pointer">
                {isChangingPassword ? (
                  "Cambiando..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

