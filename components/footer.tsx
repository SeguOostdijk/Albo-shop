"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast.error("Por favor ingresa un email válido")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Te suscribiste correctamente al newsletter")
        setEmail("")
      } else {
        toast.error(data.error || "Error al procesar la suscripción")
      }
    } catch {
      toast.error("Error al procesar la suscripción")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="overflow-x-hidden">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden py-14 md:py-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=400&fit=crop"
            alt="Estadio"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide text-primary-foreground md:text-3xl">
            Suscribite al Newsletter
          </h2>

          <p className="mb-6 text-xs uppercase tracking-wider text-primary-foreground/80 sm:text-sm">
            Para recibir ofertas y novedades en tu mail
          </p>

          <form
            className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
            onSubmit={handleNewsletterSubmit}
          >
            <Input
              type="email"
              placeholder="Ingresa tu email"
              className="h-11 flex-1 rounded-xl border-0 bg-primary-foreground text-foreground placeholder:text-foreground/60 sm:rounded-r-none sm:rounded-l-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="h-11 rounded-xl bg-accent px-6 font-bold text-accent-foreground hover:bg-accent/90 sm:rounded-l-none sm:rounded-r-xl"
              disabled={isLoading}
            >
              {isLoading ? "..." : "OK"}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Seguinos */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Seguinos</h3>

              <div className="flex justify-center gap-4 sm:justify-start">
                <a
                  href="https://www.facebook.com/cai.sancayetano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors hover:text-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>

                <a
                  href="https://www.x.com/CAI_SanCayetano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors hover:text-primary"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="h-6 w-6" />
                </a>

                <a
                  href="https://www.instagram.com/cai_sancayetano/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors hover:text-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Nosotros */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Nosotros</h3>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Quiénes somos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ayuda */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Ayuda</h3>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help/faq"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/returns"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Políticas Cambios/Devoluciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promotions"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Promociones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>

              <Link href="/policies/returns" className="inline-block w-full sm:w-auto">
                <Button className="mt-4 h-auto w-full bg-primary px-4 py-2 text-xs text-primary-foreground hover:bg-primary/90 sm:w-auto">
                  BOTÓN DE ARREPENTIMIENTO
                </Button>
              </Link>

              <p className="mt-2 text-xs text-accent">
                * Solicitud de cancelación de compra
              </p>
            </div>

            {/* Contacto */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Contacto</h3>

              <p className="mb-4 text-sm text-muted-foreground">
                Club Independiente San Cayetano
              </p>

              <Link href="/contact" className="inline-block w-full sm:w-auto">
                <Button className="h-auto w-full bg-primary px-4 py-2 text-xs uppercase text-primary-foreground hover:bg-primary/90 sm:w-auto">
                  Contactanos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase text-muted-foreground">
                Un emprendimiento de:
              </p>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-primary">
                <span className="text-xs font-bold text-accent">CABJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}