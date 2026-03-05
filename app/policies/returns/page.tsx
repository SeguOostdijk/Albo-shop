"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Políticas de Cambios y Devoluciones" },
        ]}
      />

      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Políticas de Cambios y Devoluciones</h1>

        <div className="prose max-w-none space-y-6">
          <section className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Plazo para cambios y devoluciones</h2>
            <p className="text-muted-foreground">
              Tenés <strong>30 días corridos</strong> desde la fecha de recepción del producto para realizar cambios o devoluciones. 
              Pasado este período, no aceptaremos reclamos por cambios o devoluciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Requisitos para realizar un cambio o devolución</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>El producto debe estar <strong>sin uso</strong></li>
              <li>Debe tener <strong>todas las etiquetas originales</strong> affixed</li>
              <li>El producto debe estar en su <strong>empaque original</strong></li>
              <li>No debe haber sido <strong>lavado ni modificado</strong></li>
              <li>Debés contar con el <strong>comprobante de compra</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">¿Cómo realizar un cambio?</h2>
            <p className="text-muted-foreground mb-4">
              Para realizar un cambio, tenés las siguientes opciones:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
              <li><strong>En persona:</strong> Acercate a nuestro local en Rivadavia 105, San Cayetano</li>
              <li><strong>Por WhatsApp:</strong> Escribinos al +54 9 2983 000000</li>
              <li><strong>Por email:</strong> Contactanos a info@clubindependiente.com</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Devolución del dinero</h2>
            <p className="text-muted-foreground mb-4">
              Si elegís la devolución del dinero, el proceso es el siguiente:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Recibirás el reintegro en el <strong>mismo medio de pago</strong> utilizado</li>
              <li>El plazo de reintegro es de <strong>7 a 15 días hábiles</strong> desde que receivedemos el producto</li>
              <li>No se reintegra el costo de <strong>envío</strong> (salvo error nuestro)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Productos en oferta o promoción</h2>
            <p className="text-muted-foreground">
              Los productos comprados en oferta, promoción o con descuento especial pueden ser cambiados 
              únicamente por otro producto de igual o mayor valor, no se realizan devoluciones de dinero 
              en estos casos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Costos de envío</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>El <strong>primer cambio</strong> tiene costo cero de envío</li>
              <li>Los cambios adicionales tienen un costo de envío de $2.500</li>
              <li>Las devoluciones tienen un costo de envío de $2.500 que se descuenta del reintegro</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Producto defectuoso o incorrecto</h2>
            <p className="text-muted-foreground">
              Si recibiste un producto defectuoso o diferente al solicitado, contactanos dentro de las 
              48hs de recibido el pedido. Gestionaremos el cambio o devolución <strong>sin costo adicional</strong> 
              y con prioridad.
            </p>
          </section>

          <section className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contacto para cambios y devoluciones</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>WhatsApp:</strong> +54 9 2983 000000</li>
              <li><strong>Email:</strong> info@clubindependiente.com</li>
              <li><strong>Local:</strong> Rivadavia 105, San Cayetano</li>
              <li><strong>Horario:</strong> Lun-Sáb 9:00 a 13:00 y 16:30 a 20:30hs</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

