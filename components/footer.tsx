'use client';

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
    <footer>
      {/* Newsletter Section with Stadium Background */}
      <div className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=400&fit=crop"
            alt="Estadio"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2 uppercase tracking-wide">
            Suscribite al Newsletter
          </h2>
          <p className="text-primary-foreground/80 mb-6 uppercase text-sm tracking-wider">
            Para recibir ofertas y novedades en tu mail
          </p>
          <form className="flex max-w-md mx-auto gap-0" onSubmit={handleNewsletterSubmit}>
            <Input
              type="email"
              placeholder="Ingresa tu email"
              className="flex-1 rounded-r-none bg-primary-foreground text-foreground border-0 placeholder:text-foreground/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "..." : "OK"}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* Seguinos */}
            <div>
              <h3 className="font-semibold text-lg text-primary mb-4">Seguinos</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/cai.sancayetano"  target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.x.com/CAI_SanCayetano" target="_blank" className="text-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/cai_sancayetano/" target="_blank" className="text-foreground hover:text-primary transition-colors" aria-label="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Nosotros */}
            <div>
              <h3 className="font-semibold text-lg text-primary mb-4">Nosotros</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Quienes somos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ayuda */}
            <div>
              <h3 className="font-semibold text-lg text-primary mb-4">Ayuda</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/policies/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Politicas Cambios/Devoluciones
                  </Link>
                </li>
                <li>
                  <Link href="/promotions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Promociones
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terminos y Condiciones
                  </Link>
                </li>
              </ul>
              <Link href="/policies/returns">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4 py-2 h-auto cursor-pointer">
                  BOTON DE ARREPENTIMIENTO
                </Button>
              </Link>
              <p className="text-xs text-accent mt-2">* Solicitud de cancelacion de compra</p>
            </div>

{/* Contacto */}
            <div>
              <h3 className="font-semibold text-lg text-primary mb-4">Contacto</h3>
              <p className="text-sm text-muted-foreground mb-4">Club Independiente San Cayetano</p>
              <Link href="/contact">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer uppercase text-xs px-4 py-2 h-auto w-full">
                  Contactanos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Logo */}
        <div className="border-t border-border py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs text-muted-foreground uppercase">Un emprendimiento de:</p>
              {/* Club Logo */}
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-2 border-accent">
                <span className="text-accent font-bold text-xs">CABJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
