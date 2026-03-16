"use client"

import { useState } from "react"
import {
  Truck,
  CreditCard,
  RefreshCw,
  MapPin,
  Wallet,
  ArrowRightLeft,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type BenefitType = "delivery" | "payment" | "door-to-door"

interface Benefit {
  type: BenefitType
  icon: React.ElementType
  text: string
  color: string
  bgColor: string
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    type: "delivery",
    icon: Truck,
    text: "Ver zonas de entrega",
    color: "text-primary",
    bgColor: "bg-primary/10",
    title: "Zonas de Entrega",
    description:
      "Realizamos envíos a todo el país a través de Correo Argentino y Oca. El costo de envío varía según la zona y el peso del paquete. Envío gratis en compras superiores a $80.000 en zona AMBA.",
  },
  {
    type: "payment",
    icon: CreditCard,
    text: "Métodos de pago",
    color: "text-primary",
    bgColor: "bg-primary/10",
    title: "Métodos de Pago",
    description:
      "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express). También podés pagar en efectivo a través de Rapipago o Pago Fácil. 3 y 6 cuotas sin interés con tarjetas selectas.",
  },
  {
    type: "door-to-door",
    icon: RefreshCw,
    text: "Cambios y Devoluciones",
    color: "text-accent",
    bgColor: "bg-accent/10",
    title: "Cambios y Devoluciones",
    description:
      "Si necesitas cambiar un producto, coordinamos la recolección en tu domicilio sin costo adicional. El nuevo producto se envía una vez recibido el original. Este servicio está disponible en zona AMBA.",
  },
]

const benefitDetails: Record<BenefitType, { icon: React.ElementType; items: string[] }> = {
  delivery: {
    icon: MapPin,
    items: [
      "Envíos a todo el país",
      "Costo según zona y peso",
      "Envío gratis desde $80.000 (zona AMBA)",
      "Tiempo estimado: 3-7 días hábiles",
    ],
  },
  payment: {
    icon: Wallet,
    items: [
      "Tarjetas de crédito y débito",
      "Visa, Mastercard, American Express",
      "3 y 6 cuotas sin interés",
      "Efectivo: Rapipago / Pago Fácil",
    ],
  },
  "door-to-door": {
    icon: ArrowRightLeft,
    items: [
      "Recolección en domicilio (AMBA)",
      "Sin costo adicional para el primer cambio",
      "Envío del nuevo producto al recibir el original",
      "30 días para realizar cambios",
    ],
  },
}

export function BenefitsBar() {
  const [openDialog, setOpenDialog] = useState<BenefitType | null>(null)

  return (
    <>
      <section className="bg-background py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
              {benefits.map((benefit) => (
                <button
                  key={benefit.type}
                  onClick={() => setOpenDialog(benefit.type)}
                  className={`
                    group flex min-h-[120px] w-full items-center gap-4 rounded-xl border border-border/50 p-4 text-left
                    transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:shadow-lg
                    md:h-auto md:max-w-none md:flex-col md:justify-center md:gap-3 md:p-6 md:text-center
                    ${benefit.bgColor} cursor-pointer
                  `}
                >
                  <div
                    className={`${benefit.color} shrink-0 transition-transform group-hover:scale-110`}
                  >
                    <benefit.icon className="h-9 w-9 md:h-12 md:w-12" strokeWidth={1.5} />
                  </div>

                  <span className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:max-w-[16ch]">
                    {benefit.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {benefits.map((benefit) => (
        <Dialog
          key={benefit.type}
          open={openDialog === benefit.type}
          onOpenChange={(open) => setOpenDialog(open ? benefit.type : null)}
        >
          <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] rounded-2xl sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-start gap-3 sm:items-center">
                <div className={`${benefit.bgColor} ${benefit.color} rounded-full p-3`}>
                  <benefit.icon className="h-6 w-6" />
                </div>
                <DialogTitle className="text-lg sm:text-xl">{benefit.title}</DialogTitle>
              </div>
            </DialogHeader>

            <DialogDescription className="mt-4 text-sm leading-6 text-foreground sm:text-base">
              {benefit.description}
            </DialogDescription>

            <div className="mt-6 border-t pt-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
                Características
              </h4>

              <ul className="space-y-3">
                {benefitDetails[benefit.type].items.map((item, idx) => {
                  const DetailIcon = benefitDetails[benefit.type].icon
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 shrink-0 ${benefit.color}`}>
                        <DetailIcon className="h-4 w-4" />
                      </div>
                      <span className="text-sm leading-5 text-foreground">{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
}