import { Truck, CheckSquare, CreditCard, RefreshCw } from "lucide-react"

const benefits = [
  {
    icon: Truck,
    text: "Ver zonas de entrega",
    color: "text-primary",
  },
  {
    icon: CheckSquare,
    text: "Primer Cambio Gratis",
    color: "text-accent",
  },
  {
    icon: CreditCard,
    text: "Metodos de pago",
    color: "text-primary",
  },
  {
    icon: RefreshCw,
    text: "Cambios Puerta a Puerta",
    color: "text-accent",
  },
]

export function BenefitsBar() {
  return (
    <section className="py-8 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-3"
            >
              <div className={`${benefit.color}`}>
                <benefit.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
