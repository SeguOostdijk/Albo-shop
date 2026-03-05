import { Tag, Gift, Percent, Truck, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Promotion {
  id: string
  title: string
  description: string
  code?: string
  discount?: string
  type: "shipping" | "discount" | "special" | "new"
  expiresAt?: string
  icon: React.ReactNode
  cta: string
  ctaLink: string
}

const promotions: Promotion[] = [
  {
    id: "1",
    title: "ENVÍO GRATIS",
    description: "En compras superiores a $75.000 el envío es completamente gratis a todo el país.",
    type: "shipping",
    expiresAt: "Vigente siempre",
    icon: <Truck className="h-8 w-8" />,
    cta: "Ver Productos",
    ctaLink: "/category/hombre",
  },
  {
    id: "2",
    title: "10% OFF PRIMERA COMPRA",
    description: "Obtené 10% de descuento en tu primera compra usando el código de abajo.",
    code: "BIENVENIDO10",
    discount: "10%",
    type: "discount",
    expiresAt: "Sin fecha de vencimiento",
    icon: <Percent className="h-8 w-8" />,
    cta: "Empezar a Comprar",
    ctaLink: "/category/hombre",
  },
  {
    id: "3",
    title: "20% OFF SOCIOS",
    description: "Si sos socio del club, accedé a un descuento especial del 20% en toda la tienda.",
    code: "SOCIO20",
    discount: "20%",
    type: "special",
    expiresAt: "Vigente siempre",
    icon: <Star className="h-8 w-8" />,
    cta: "Registrarme como Socio",
    ctaLink: "/account/register",
  },
  {
    id: "4",
    title: "2da UNIDAD 30% OFF",
    description: "En productos seleccionados, la segunda unidad tiene 30% de descuento.",
    type: "special",
    expiresAt: "Hasta agotar stock",
    icon: <ShoppingBag className="h-8 w-8" />,
    cta: "Ver Ofertas",
    ctaLink: "/category/ofertas",
  },
  {
    id: "5",
    title: "DESCUENTO POR VOLUMEN",
    description: "Compras mayoristas: consultá por descuentos especiales en pedidos grandes.",
    type: "special",
    expiresAt: "Vigente siempre",
    icon: <Gift className="h-8 w-8" />,
    cta: "Contactar Ventas",
    ctaLink: "mailto:ventas@club.com",
  },
]

const getTypeStyles = (type: Promotion["type"]) => {
  switch (type) {
    case "shipping":
      return "bg-blue-50 border-blue-200 text-blue-700"
    case "discount":
      return "bg-green-50 border-green-200 text-green-700"
    case "special":
      return "bg-red-50 border-red-200 text-red-700"
    case "new":
      return "bg-purple-50 border-purple-200 text-purple-700"
    default:
      return "bg-muted"
  }
}

const getIconStyles = (type: Promotion["type"]) => {
  switch (type) {
    case "shipping":
      return "bg-blue-100 text-blue-600"
    case "discount":
      return "bg-green-100 text-green-600"
    case "special":
      return "bg-red-100 text-red-600"
    case "new":
      return "bg-purple-100 text-purple-600"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function PromotionsContent() {
  return (
    <div className="space-y-8">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Aprovechá las mejores ofertas!
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Encontrá productos oficiales del club con descuentos exclusivos. 
            No te pierdas nuestras promociones por tiempo limitado.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="font-semibold"
            >
              <a href="/category/hombre">Ver Catálogo Completo</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Promociones */}
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">Promociones Vigentes</h2>
        
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`border-2 rounded-xl p-6 ${getTypeStyles(promo.type)}`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Icono */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getIconStyles(promo.type)} flex-shrink-0`}>
                {promo.icon}
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{promo.title}</h3>
                  {promo.discount && (
                    <span className="px-2 py-0.5 bg-current text-current-opposite text-sm font-bold rounded">
                      {promo.discount}
                    </span>
                  )}
                </div>
                <p className="opacity-80 mb-2">{promo.description}</p>
                
                {promo.code && (
                  <div className="inline-flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2 mt-2">
                    <Tag className="h-4 w-4" />
                    <code className="font-mono font-bold">{promo.code}</code>
                  </div>
                )}
                
                <p className="text-sm opacity-70 mt-2">
                  {promo.expiresAt && (
                    <span className="flex items-center gap-1">
                      <span>•</span> {promo.expiresAt}
                    </span>
                  )}
                </p>
              </div>
              
              {/* CTA */}
              <div className="flex-shrink-0">
                <Button asChild className="w-full md:w-auto">
                  <a href={promo.ctaLink}>{promo.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cómo Usar los Códigos */}
      <div className="bg-muted rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">¿Cómo usar los códigos de descuento?</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Elegí los productos que querés comprar</li>
          <li>Agregalos al carrito</li>
          <li>En el checkout, buscá el campo "Código de descuento"</li>
          <li>Ingresá el código y hacé clic en "Aplicar"</li>
          <li>El descuento se verá reflejado en el total</li>
        </ol>
      </div>

      {/* Newsletter */}
      <div className="border rounded-xl p-8 text-center">
        <Gift className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-bold mb-2">Recibí ofertas exclusivas</h3>
        <p className="text-muted-foreground mb-4">
          Suscribite a nuestro newsletter y sé el primero en enterarte de las promociones
        </p>
        <form className="flex max-w-md mx-auto gap-0" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Ingresa tu email"
            className="flex-1 rounded-r-none border-r-0"
          />
          <Button type="submit" className="rounded-l-none">
            Suscribirme
          </Button>
        </form>
      </div>

      {/* Información Adicional */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="text-center p-4">
          <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h4 className="font-semibold">Envío Gratis</h4>
          <p className="text-sm text-muted-foreground">En compras mayores a $75.000</p>
        </div>
        <div className="text-center p-4">
          <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h4 className="font-semibold">Productos Oficiales</h4>
          <p className="text-sm text-muted-foreground">100% originales del club</p>
        </div>
        <div className="text-center p-4">
          <Percent className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h4 className="font-semibold">Los Mejores Precios</h4>
          <p className="text-sm text-muted-foreground">Garantizados</p>
        </div>
      </div>
    </div>
  )
}

