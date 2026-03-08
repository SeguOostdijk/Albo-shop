"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { supabase } from "@/lib/supabase/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      })

      if (error) {
        toast.error(error.message || "Error al enviar el email de recuperación")
      } else {
        setEmailSent(true)
        toast.success("Revisa tu email para restablecer tu contraseña")
      }
    } catch {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Mi Cuenta", href: "/account" },
            { label: "Recuperar Contraseña" },
          ]}
        />

        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Email Enviado
              </CardTitle>
              <CardDescription className="text-center">
                Te hemos enviado un enlace para restablecer tu contraseña
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Revisa tu bandeja de entrada y sigue las instrucciones del email.
                No olvides verificar la carpeta de spam.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/account/login">
                <Button variant="outline">
                  Volver a Iniciar Sesión
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
          { label: "Recuperar Contraseña" },
        ]}
      />

      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Olvidaste tu Contraseña?
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="placeholder:text-muted-foreground/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  "Enviando..."
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Enviar Enlace de Recuperación
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

