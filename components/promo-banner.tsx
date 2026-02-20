import { Truck, CreditCard, RefreshCw, Shield } from "lucide-react"

const promos = [
  {
    icon: Truck,
    title: "Envio Gratis",
    description: "En compras mayores a $75.000",
  },
  {
    icon: CreditCard,
    title: "3 Cuotas Sin Interes",
    description: "Con todas las tarjetas",
  },
  {
    icon: RefreshCw,
    title: "Cambios Gratis",
    description: "Hasta 30 dias despues",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Tus datos protegidos",
  },
]

export function PromoBanner() {
  return (
    <section className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {promos.map((promo) => (
            <div key={promo.title} className="flex flex-col items-center text-center">
              <promo.icon className="h-8 w-8 text-secondary mb-2" />
              <h3 className="font-semibold text-sm">{promo.title}</h3>
              <p className="text-xs text-muted-foreground">{promo.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
