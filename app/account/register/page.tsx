"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuthStore } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, loading } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !fullName) {
      toast.error("Por favor completá todos los campos")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const { error } = await signUp(email, password, fullName)
    
    if (error) {
      toast.error("Error al crear la cuenta. Probá con otro email.")
    } else {
      toast.success("¡Cuenta creada! Por favor verificá tu email.")
      router.push("/account")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[
        { label: "Mi Cuenta", href: "/account" },
        { label: "Crear Cuenta" }
      ]} />

      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">¡Creá tu cuenta!</CardTitle>
            <CardDescription>
              Completá tus datos para registrarte en la tienda
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nombre completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#0f2f98] hover:bg-[#0a2475]"
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tenés cuenta?{" "}
                <Link href="/account/login" className="text-[#0f2f98] hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

