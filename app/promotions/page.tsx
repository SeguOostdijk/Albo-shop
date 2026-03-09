"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import Link from "next/link"
import Image from "next/image"

export default function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Promociones" },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Promociones y Ofertas</h1>

        <div className="space-y-8">
          {/* Promo Banner 1 */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 text-center">
            <div className="relative z-10">
              <span className="inline-block bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
                ENVÍO GRÁTIS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                Compras mayores a $75.000
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                Envío gratis a todo el país en pedidos superiores a $75.000
              </p>
              <Link 
                href="/category/primera-division"
                className="inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary-foreground transition-colors"
              >
                Ver Productos
              </Link>
            </div>
          </div>

          {/* Promo Banner 2 */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-secondary to-secondary/80 p-8 md:p-12 text-center">
            <div className="relative z-10">
              <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
                3 CUOTAS SIN INTERÉS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Pagá en cuotas
              </h2>
              <p className="text-muted-foreground mb-6">
                Todas las tarjetas de crédito y débito en 3 cuotas sin interés
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-muted p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="font-semibold mb-2">Envío Express</h3>
              <p className="text-sm text-muted-foreground">
                Entrega en 24-48hs en CABA y GBA
              </p>
            </div>

            <div className="bg-muted p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold mb-2">Cambios gratis</h3>
              <p className="text-sm text-muted-foreground">
                Primer cambio sin costo en cualquier producto
              </p>
            </div>

            <div className="bg-muted p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-semibold mb-2">Descuentos exclusivos</h3>
              <p className="text-sm text-muted-foreground">
                Seguinos en redes para más ofertas
              </p>
            </div>
          </div>

          {/* Newsletter Promo */}
          <div className="bg-muted p-8 rounded-2xl text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">¡No te pierdas ninguna oferta!</h2>
            <p className="text-muted-foreground mb-6">
              Suscribite a nuestro newsletter y recibí en tu email todas las promociones y novidades
            </p>
            <form className="flex max-w-md mx-auto gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-l-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-r-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

