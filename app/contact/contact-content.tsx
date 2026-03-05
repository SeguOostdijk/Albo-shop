"use client"

import { MessageCircle, Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    alert("Gracias por contactarnos. Te responderemos a la brevedad.")
  }

  return (
    <div className="space-y-8">
      {/* Información de Contacto */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted rounded-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Chateá con nosotros de manera rápida
          </p>
          <a
            href="https://wa.me/542983000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Escribir
          </a>
        </div>

        <div className="bg-muted rounded-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-7 w-7" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Email</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Respondemos en 24 horas
          </p>
          <a
            href="mailto:tienda@club.com"
            className="text-primary hover:underline text-sm font-medium"
          >
            tienda@club.com
          </a>
        </div>

        <div className="bg-muted rounded-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Phone className="h-7 w-7" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Teléfono</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Lun a Vie de 9 a 18hs
          </p>
          <a
            href="tel:+542983000000"
            className="text-primary hover:underline text-sm font-medium"
          >
            +54 9 2983 000000
          </a>
        </div>
      </div>

      {/* Formulario de Contacto */}
      <div className="border rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Envianos un mensaje</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre completo *
              </label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+54 9 11 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Asunto *
              </label>
              <Input
                id="subject"
                placeholder="Ej: Consulta sobre un producto"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Mensaje *
            </label>
            <Textarea
              id="message"
              placeholder="Escribí tu consulta..."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensaje
          </Button>
        </form>
      </div>

      {/* Información Adicional */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Nuestra Tienda</h3>
              <p className="text-muted-foreground">
                Rivadavia 105<br />
                San Cayetano<br />
                Buenos Aires, Argentina
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Horario de Atención</h3>
              <ul className="text-muted-foreground space-y-1">
                <li className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sábados</span>
                  <span className="font-medium">09:00 - 13:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Domingos</span>
                  <span className="font-medium">Cerrado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa (opcional) */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-muted h-64 flex items-center justify-center">
          <p className="text-muted-foreground">
            Aquí iría un mapa de Google
          </p>
        </div>
      </div>
    </div>
  )
}

