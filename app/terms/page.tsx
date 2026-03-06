"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Términos y Condiciones" },
        ]}
      />

      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Términos y Condiciones</h1>

        <div className="prose max-w-none space-y-6 text-muted-foreground">
          <p>
            Bienvenido a la Tienda Oficial del Club Atlético Independiente de San Cayetano. 
            Al acceder y utilizar este sitio web, aceptás los siguientes términos y condiciones.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Uso del sitio</h2>
            <p>
              Este sitio es propiedad de Club Atlético Independiente de San Cayetano. 
              Está prohibido utilizar el sitio para cualquier propósito ilegal o no autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Cuentas de usuario</h2>
            <p>
              Para realizar compras, podrás crear una cuenta o comprar como invitado. 
              Sos responsable de mantener la confidencialidad de tu cuenta y contraseña.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Productos y precios</h2>
            <p>
              Los precios de los productos displayed en el sitio están expresados en pesos argentinos 
              e incluyen IVA. Nos reservamos el derecho de modificar precios en cualquier momento 
              sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Políticas de venta</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Todos los productos están sujetos a disponibilidad</li>
              <li>Las imágenes son referenciales y pueden diferir del producto real</li>
              <li>Nos reservamos el derecho de cancelar cualquier orden</li>
              <li>Los productos incluyen garantía del fabricante</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Envíos y entregas</h2>
            <p>
              Los envíos se realizan a todo el territorio argentino. Los tiempos de entrega 
              varían según la zona. El costo de envío será calculado al momento de la compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Cambios y devoluciones</h2>
            <p>
              Aceptamos cambios y devoluciones dentro de los 30 días de recibido el producto, 
              según las condiciones establecidas en nuestra política de cambios y devoluciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Propiedad intelectual</h2>
            <p>
              Todo el contenido de este sitio, incluyendo imágenes, logos, textos y diseño, 
              es propiedad de Club Atlético Independiente de San Cayetano y está protegido 
              por las leyes de propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Privacidad</h2>
            <p>
              La información personal que proporciones será tratada de acuerdo a nuestra 
              Política de Privacidad. Al utilizar el sitio, aceptás el tratamiento de tus datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Limitación de responsabilidad</h2>
            <p>
              No seremos responsables por daños directos, indirectos, incidentales o 
              consequenciales derivados del uso de este sitio o la compra de productos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Contacto</h2>
            <p>
              Para consultas sobre estos términos y condiciones, podés contactarnos a 
              info@clubindependiente.com o al +54 9 2983 000000.
            </p>
          </section>

          <p className="text-sm">
            Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}

