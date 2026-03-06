"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Quiénes Somos" },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Quiénes Somos</h1>

        {/* Club Image */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=600&fit=crop"
            alt="Estadio Club Atlético Independiente"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            <strong className="text-foreground">Club Atlético Independiente de San Cayetano</strong> es una institución 
            deportiva con una larga trayectoria en el fútbol argentino. Ubicados en el corazón de San Cayetano, 
            Buenos Aires, somos mucho más que un club de fútbol: somos una comunidad que promueve valores como 
            el respeto, la disciplina y la pasión por el deporte.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Nuestra Historia</h2>
            <p>
              Fundado hace más de 50 años, nuestro club ha sido formador de grandes talentos del fútbol argentino. 
              Desde nuestros inicios, hemos participado en ligas locales y regionales, construyendo una identidad 
              basada en el trabajo duro y el compromiso con nuestros hinchas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">La Tienda Oficial</h2>
            <p>
              La Tienda Oficial del Club Atlético Independiente de San Cayetano ofrece a nuestros hinchas 
              la oportunidad de llevar consigo los colores de su club. Contamos con una amplia gama de productos 
              oficiales incluyendo camisetas, buzos, camperas, accesorios y mucho más.
            </p>
            <p className="mt-2">
              Todos nuestros productos son de primera calidad, con materiales resistentes y diseños exclusivos 
              que representan la identidad de nuestro club.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Nuestros Valores</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Pasión:</strong> Vivimos y sentimos el fútbol con el corazón</li>
              <li><strong className="text-foreground">Compromiso:</strong> Damos todo por nuestra camiseta en cada partido</li>
              <li><strong className="text-foreground">Respeto:</strong> Valoramos a nuestros rivales, hinchas y a toda la comunidad</li>
              <li><strong className="text-foreground">Tradición:</strong> Honramos la historia y los logros de nuestro club</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Visítanos</h2>
            <p>
              Te esperamos en nuestro local comercial ubicado en <strong className="text-foreground">Rivadavia 105, San Cayetano</strong>. 
              Nuestro horario de atención es de Lunes a Sábado de 9:00 a 13:00 y de 16:30 a 20:30hs.
            </p>
            <p className="mt-2">
              También podés contactarnos al <strong className="text-foreground">+54 9 2983 000000</strong> o 
              escribrinos a <strong className="text-foreground">info@clubindependiente.com</strong>
            </p>
          </section>

          {/* Social Links */}
          <section className="bg-muted p-6 rounded-xl mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Seguinos en redes</h2>
            <p className="mb-4">
              Enterate de todas las novedades, partidos y promociones siguiendo nuestras redes sociales.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary hover:underline">
                Facebook
              </a>
              <a href="#" className="text-primary hover:underline">
                Instagram
              </a>
              <a href="#" className="text-primary hover:underline">
                X (Twitter)
              </a>
            </div>
          </section>

          {/* Mission Statement */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl text-center mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">Nuestra Misión</h3>
            <p className="text-lg italic">
              "Ser el nexo entre nuestros hinchas y el club, ofreciendo productos de calidad que representen 
              la pasión y tradición de Club Atlético Independiente de San Cayetano"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

