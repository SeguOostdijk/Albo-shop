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
            ¡ASÓCIATE YA!
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            No sos socio? <span className="font-bold text-foreground">Asociate ya</span> y accede a los mejores precios
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

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="group bg-background/80 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 hover:bg-gradient-to-br from-primary/5 to-accent/10">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
              <Percent className="h-8 w-8 text-primary drop-shadow-lg" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-center group-hover:text-primary transition-colors">
              Precios Exclusivos
            </h3>
            <p className="text-lg text-muted-foreground text-center leading-relaxed max-w-md mx-auto">
              Hasta 30% OFF en todos los productos y promociones especiales solo para socios
            </p>
          </div>

          <div className="group bg-background/80 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 hover:bg-gradient-to-br from-primary/5 to-accent/10">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
              <Users className="h-8 w-8 text-primary drop-shadow-lg" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-center group-hover:text-primary transition-colors">
              Eventos Privados
            </h3>
            <p className="text-lg text-muted-foreground text-center leading-relaxed max-w-md mx-auto">
              Acceso prioritario a eventos del club, presentaciones de indumentaria y beneficios deportivos
            </p>
          </div>

          <div className="group bg-background/80 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 hover:bg-gradient-to-br from-primary/5 to-accent/10 md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-gradient-to-r from-accent to-destructive/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
              <Star className="h-8 w-8 text-accent drop-shadow-lg" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-center group-hover:text-primary transition-colors">
              Comunidad Exclusiva
            </h3>
            <p className="text-lg text-muted-foreground text-center leading-relaxed max-w-md mx-auto">
              Forma parte de la comunidad de socios con descuentos permanentes, sorteos y atención prioritaria
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-12 md:p-20 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-8 tracking-tight">
            ¡Unite a la familia!
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Miles de socios ya disfrutan estos beneficios. <br className="md:hidden" />
            <span className="font-bold text-foreground">¡Tu turno!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-12 py-8 text-lg shadow-2xl hover:shadow-3xl rounded-2xl border-4 border-white/20 hover:border-white/40 w-full sm:w-auto order-2 sm:order-1"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Ahora
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-2 border-primary/50 text-primary hover:bg-primary/5 hover:border-primary font-bold px-12 py-8 text-lg rounded-2xl shadow-xl hover:shadow-2xl w-full sm:w-auto order-1 sm:order-2"
            >
              <Link href="/sponsors" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Volver a Sponsors
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
