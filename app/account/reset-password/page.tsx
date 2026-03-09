"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { supabase } from "@/lib/supabase/auth"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Check if user has a valid session from the password reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // No valid session, token may be expired or invalid
        setIsValidToken(false)
      }
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    setIsUpdating(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        toast.error(error.message || "Error al actualizar la contraseña")
      } else {
        toast.success("Contraseña actualizada correctamente")
        // Sign out and redirect to login
        await supabase.auth.signOut()
        router.push("/account/login")
      }
    } catch {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
      setIsUpdating(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Mi Cuenta", href: "/account" },
            { label: "Restablecer Contraseña" },
          ]}
        />

        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Enlace Vencido
              </CardTitle>
              <CardDescription className="text-center">
                El enlace para restablecer tu contraseña ha expirado o ya fue utilizado
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Por favor, solicitá un nuevo enlace de recuperación de contraseña.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Link href="/account/login">
                <Button variant="outline">
                  Volver a Iniciar Sesión
                </Button>
              </Link>
              <Link href="/account/forgot-password">
                <Button>
                  Solicitar Nuevo Enlace
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Mi Cuenta", href: "/account" },
          { label: "Restablecer Contraseña" },
        ]}
      />

      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Nueva Contraseña
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tu nueva contraseña
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="placeholder:text-muted-foreground/60 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repetí tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                disabled={isLoading || isUpdating}
              >
                {isLoading ? (
                  "Actualizando..."
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Actualizar Contraseña
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Recordaste tu contraseña?{" "}
                <Link
                  href="/account/login"
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

