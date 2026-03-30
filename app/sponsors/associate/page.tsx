"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Percent, Star, Award, MessageCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function AssociatePage() {
  const whatsappNumber = '5492983348357'
  const whatsappMessage = 'Hola%2C%20quiero%20asociarme%20al%20Club%20Independiente%20de%20San%20Cayetano.%20%C2%A1Cu%C3%A9ntame%20c%C3%B3mo%20hacerlo!%20https%3A//clubshop.com.ar'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-accent/20 py-12 md:py-20">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Sponsors", href: "/sponsors" },
          { label: "Asociate" },
        ]}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-20 md:mb-28">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-8 tracking-tight leading-tight">
            ¡ASOCIATE YA!
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            ¿No sos socio? <span className="font-bold text-foreground">Unite a la familia</span> y accede a descuentos de hasta el 30% en indumentaria oficial, accesorios y mucho más. <br className="md:hidden" />
          </p>
          
          <Button 
            asChild
            size="lg" 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-16 py-8 text-xl md:text-2xl shadow-2xl hover:shadow-3xl rounded-3xl border-4 border-white/20 hover:border-white/40 transform hover:scale-[1.05] transition-all duration-300 mx-auto"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
              Contactar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
