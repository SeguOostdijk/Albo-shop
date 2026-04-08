"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function FAQPage() {
  const faqItems = [
    {
      question: "¿Cómo realizo una compra?",
      answer: "Para realizar una compra, simplemente navegá por nuestra tienda, seleccioná el producto que quieras, elegí el talle y color, y hacé clic en 'Agregar al Carrito'. Luego, podés continuar comprando o proceder al checkout para completar tu compra."
    },
    {
      question: "¿Cuáles son los métodos de pago aceptados?",
      answer: "Aceptamos todos los métodos de pago incluyendo tarjetas de crédito y débito (Visa, Mastercard, American Express), MercadoPago, y transferencias bancarias."
    },
    {
      question: "¿Realizan envíos a todo el país?",
      answer: "Sí, realizamos envíos a todo el país. El costo de envío varía según la zona y el peso del pedido."
    },
    {
      question: "¿Cuánto tiempo tarda el envío?",
      answer: "Los tiempos de entrega varían según tu ubicación. El envío estándar demora entre 3 y 7 días hábiles."
    },
    {
      question: "¿Cómo realizo un cambio o devolución?",
      answer: "Tenés 30 días para realizar cambios o devoluciones. El producto debe estar sin uso y con todas las etiquetas originales. Podés acercarte a nuestro local o contactarnos para gestionar el cambio."
    },
    {
      question: "¿Qué pasa si mi producto llega dañado o incorrecto?",
      answer: "Si tu producto llega dañado o incorrecto, contactanos dentro de las 48hs de recibido el pedido. Vamos a gestionar el cambio o devolución sin costo adicional."
    },
    {
      question: "¿Tienen local físico?",
      answer: "Sí, nuestro local está ubicado en Rivadavia 150, San Cayetano. Nuestro horario de atención es de Lunes a Viernes de 9:00 a 12:00 y de 17:00 a 20:00hs."
    },
    {
      question: "¿Cómo me contacto con atención al cliente?",
      answer: "Podés contactarnos al +54 9 2983 34-8357, escribrinos por WhatsApp, o mandarnos un email a alboshopcai@gmail.com"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Preguntas Frecuentes" },
        ]}
      />

      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h1>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
<AccordionTrigger className="text-left cursor-pointer">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h3 className="font-semibold text-lg mb-2">¿No encontraste lo que buscabas?</h3>
          <p className="text-muted-foreground mb-4">
            Contactanos y te ayudaremos a resolver cualquier duda
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  )
}

