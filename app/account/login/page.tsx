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

export default function LoginPage() {
  const router = useRouter()
  const { signIn, loading } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Por favor completá todos los campos")
      return
    }

    const { error } = await signIn(email, password)
    
    if (error) {
      toast.error("Email o contraseña incorrectos")
    } else {
      toast.success("¡Bienvenido de nuevo!")
      router.push("/account")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[
        { label: "Mi Cuenta", href: "/account" },
        { label: "Iniciar Sesión" }
      ]} />

      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">¡Bienvenido de nuevo!</CardTitle>
            <CardDescription>
              Ingresá tu email y contraseña para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#0f2f98] hover:bg-[#0a2475]"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                ¿No tenés cuenta?{" "}
                <Link href="/account/register" className="text-[#0f2f98] hover:underline font-medium">
                  Crear cuenta
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

