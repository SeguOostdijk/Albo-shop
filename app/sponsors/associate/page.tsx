"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users, ArrowRight } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

const STEPS = [
  { number: "01", text: "Contactanos por WhatsApp" },
  { number: "02", text: "Abonás la cuota mensual" },
  { number: "03", text: "¡Ya sos parte del club!" },
]

export default function AssociatePage() {
  const whatsappNumber = "5492983348357"
  const whatsappMessage =
    "Hola%2C%20quiero%20asociarme%20al%20Club%20Independiente%20de%20San%20Cayetano.%20%C2%A1Cu%C3%A9ntame%20c%C3%B3mo%20hacerlo!%20https%3A//clubshop.com.ar"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8 md:py-16">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Sponsors", href: "/sponsors" },
            { label: "Asociate" },
          ]}
        />

        {/* Hero */}
        <div className="text-center pt-8 mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            Club Atlético Independiente
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 tracking-tight leading-[1.05]">
            ASOCIATE
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Formá parte de la familia del club y accedé a{" "}
            <span className="font-bold text-foreground">descuentos de hasta el 30%</span>{" "}
            en indumentaria oficial, accesorios y beneficios exclusivos.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-7 text-lg shadow-2xl rounded-2xl border-2 border-white/20 hover:scale-[1.03] transition-all duration-300"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 shrink-0" />
              Contactar por WhatsApp
            </a>
          </Button>
        </div>

        {/* Steps */}
        <div className="py-8 md:py-12">
          <h2 className="text-xl sm:text-2xl font-black text-center mb-10 text-foreground uppercase tracking-wide">
            ¿Cómo asociarse?
          </h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-3 w-32">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-black text-primary">{step.number}</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
