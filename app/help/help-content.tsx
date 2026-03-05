import Link from "next/link"
import { HelpCircle, MessageCircle, Mail, Phone, Package, ShoppingCart, Truck, Shield, FileText } from "lucide-react"

const helpCategories = [
  {
    title: "Compras",
    description: "Todo sobre cómo comprar en nuestra tienda",
    icon: ShoppingCart,
    href: "/help/faq",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Envíos",
    description: "Información sobre envíos y entregas",
    icon: Truck,
    href: "/help/faq",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Cambios y Devoluciones",
    description: "Política de cambios y devoluciones",
    icon: Package,
    href: "/policies/returns",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Promociones",
    description: "Ofertas y descuentos disponibles",
    icon: Shield,
    href: "/promotions",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Términos y Condiciones",
    description: "Términos de uso del sitio",
    icon: FileText,
    href: "/terms",
    color: "bg-gray-100 text-gray-600",
  },
  {
    title: "Preguntas Frecuentes",
    description: "Respuestas a las dudas más comunes",
    icon: HelpCircle,
    href: "/help/faq",
    color: "bg-cyan-100 text-cyan-600",
  },
]

export function HelpContent() {
  return (
    <div className="space-y-8">
      {/* Categorías de Ayuda */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="block p-6 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color} flex-shrink-0`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Opciones de Contacto */}
      <div className="bg-muted rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">¿No encontraste lo que buscabas?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Chateá con nosotros
            </p>
            <a
              href="https://wa.me/542983000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Escribir
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Respondemos en 24hs
            </p>
            <a
              href="mailto:tienda@club.com"
              className="inline-flex items-center justify-center px-4 py-2 border border-input hover:bg-accent transition-colors bg-background rounded-lg text-sm"
            >
              Enviar Email
            </a>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-1">Teléfono</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Lun a Vie de 9 a 18hs
            </p>
            <a
              href="tel:+542983000000"
              className="inline-flex items-center justify-center px-4 py-2 border border-input hover:bg-accent transition-colors bg-background rounded-lg text-sm"
            >
              Llamar
            </a>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3">Horario de Atención</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between">
              <span>Lunes a Viernes</span>
              <span>09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span>Sábados</span>
              <span>09:00 - 13:00</span>
            </li>
            <li className="flex justify-between">
              <span>Domingos</span>
              <span>Cerrado</span>
            </li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-3">Ubicación</h3>
          <p className="text-sm text-muted-foreground">
            Rivadavia 105<br />
            San Cayetano<br />
            Buenos Aires, Argentina
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            <strong>Club Atlético Independiente</strong><br />
            de San Cayetano
          </p>
        </div>
      </div>
    </div>
  )
}

