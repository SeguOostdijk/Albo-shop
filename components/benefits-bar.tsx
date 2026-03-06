"use client"

import { useState } from "react"
import { Truck, CreditCard, RefreshCw, MapPin, Wallet, ArrowRightLeft } from "lucide-react"
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
    description: "Realizamos envíos a todo el país a través de Correo Argentino y Oca. El costo de envío varía según la zona y el peso del paquete. Envío gratis en compras superiores a $80.000 en zona AMBA.",
  },
  {
    type: "payment",
    icon: CreditCard,
    text: "Métodos de pago",
    color: "text-primary",
    bgColor: "bg-primary/10",
    title: "Métodos de Pago",
    description: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express). También podés pagar en efectivo a través de Rapipago o Pago Fácil. 3 y 6 cuotas sin interés con tarjetas selectas.",
  },
  {
    type: "door-to-door",
    icon: RefreshCw,
    text: "Cambios y Devoluciones",
    color: "text-accent",
    bgColor: "bg-accent/10",
    title: "Cambios y Devoluciones",
    description: "Si necesitas cambiar un producto, coordinamos la recolección en tu domicilio sin costo adicional. El nuevo producto se envía una vez recibido el original. Este servicio está disponible en zona AMBA.",
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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <button
                  key={index}
                  onClick={() => setOpenDialog(benefit.type)}
                  className={`
                    flex flex-col items-center justify-center gap-3 p-6 rounded-xl w-40 md:w-48
                    border-2 border-transparent transition-all duration-300
                    hover:border-primary hover:shadow-lg hover:scale-105
                    ${benefit.bgColor} cursor-pointer group
                  `}
                >
                  <div className={`${benefit.color} group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                    {benefit.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      {benefits.map((benefit) => (
        <Dialog
          key={benefit.type}
          open={openDialog === benefit.type}
          onOpenChange={(open) => setOpenDialog(open ? benefit.type : null)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={`${benefit.bgColor} ${benefit.color} p-3 rounded-full`}>
                  <benefit.icon className="w-6 h-6" />
                </div>
                <DialogTitle className="text-xl">{benefit.title}</DialogTitle>
              </div>
            </DialogHeader>
            <DialogDescription className="text-base text-foreground mt-4">
              {benefit.description}
            </DialogDescription>
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                Características
              </h4>
              <ul className="space-y-3">
                {benefitDetails[benefit.type].items.map((item, idx) => {
                  const DetailIcon = benefitDetails[benefit.type].icon
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 ${benefit.color}`}>
                        <DetailIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
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

