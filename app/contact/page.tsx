"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Contacto" },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Contacto</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-muted p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Envianos un mensaje</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-2">Nombre completo</label>
                <Input placeholder="Tu nombre" className="placeholder:text-muted-foreground/60" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="tu@email.com" className="placeholder:text-muted-foreground/60" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <Input type="tel" placeholder="+54 9 2983 000000" className="placeholder:text-muted-foreground/60" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mensaje</label>
                <Textarea placeholder="¿En qué podemos ayudarte?" rows={5} className="placeholder:text-muted-foreground/60" />
              </div>
              <Button className="w-full cursor-pointer">Enviar mensaje</Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="text-muted-foreground">Rivadavia 105<br />San Cayetano, Buenos Aires</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="text-muted-foreground">+54 9 2983 000000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">info@clubindependiente.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Horario de atención</h3>
                    <p className="text-muted-foreground">
                      Lunes a Sábado<br />
                      9:00 a 13:00 hs<br />
                      16:30 a 20:30 hs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-green-500 p-6 rounded-xl text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp</h3>
                  <p className="text-white/80">Chateá con nosotros</p>
                </div>
              </div>
              <a 
                href="https://wa.me/542983000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 block w-full bg-white text-green-500 text-center py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Iniciar chat
              </a>
            </div>

{/* Social Media */}
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Seguinos en redes</h3>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/cai.sancayetano" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-primary" />
                </a>
                <a 
                  href="https://www.x.com/CAI_SanCayetano" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="h-5 w-5 text-primary" />
                </a>
                <a 
                  href="https://www.instagram.com/cai_sancayetano/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Nuestra ubicación</h2>
          <div className="bg-muted rounded-xl overflow-hidden h-64 flex items-center justify-center">
            <p className="text-muted-foreground">
              Rivadavia 105, San Cayetano, Buenos Aires
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

