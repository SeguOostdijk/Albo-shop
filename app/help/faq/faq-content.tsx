"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqCategories = [
  {
    title: "Compras y Productos",
    items: [
      {
        question: "¿Cómo realizo una compra?",
        answer: "Para realizar una compra, navegá por nuestra tienda, selecciona el producto que deseas, elegí talle y color, agregalo al carrito y proceede al checkout. Necesitarás crear una cuenta o iniciar sesión para completar la compra.",
      },
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos todos los medios de pago: tarjetas de crédito (Visa, Mastercard, American Express), tarjetas de débito, Mercado Pago y transferencias bancarias. También podés pagar en efectivo en puntos de pago autorizados.",
      },
      {
        question: "¿Puedo comprar sin registrarme?",
        answer: "Sí, podés realizar compras como guest. Sin embargo, te recomendamos crear una cuenta para poder seguir tus pedidos, acceder al historial de compras y recibir ofertas exclusivas.",
      },
      {
        question: "¿Cómo sé mi talle correcto?",
        answer: "En cada producto encontrarás una guía de talles. Haciendo clic en 'Guía de talles' podrás ver las medidas exactas para cada talle. Si tenés dudas, podés contactarnos por WhatsApp.",
      },
    ],
  },
  {
    title: "Envíos",
    items: [
      {
        question: "¿Cuánto cuesta el envío?",
        answer: "El envío tiene un costo de $5.999 para todo el país. Es gratis en compras superiores a $75.000. Los tiempos de entrega varían entre 3 y 10 días hábiles según tu ubicación.",
      },
      {
        question: "¿A dónde pueden enviar?",
        answer: "Realizamos envíos a todo el territorio argentino. También podés retirar tu pedido por nuestro local en Rivadavia 105, San Cayetano.",
      },
      {
        question: "¿Cuánto tiempo tarda en llegar mi pedido?",
        answer: "Los tiempos de entrega son de 3 a 5 días hábiles para Capital Federal y Gran Buenos Aires, y de 5 a 10 días hábiles para el resto del país, una vez acreditado el pago.",
      },
      {
        question: "¿Puedo seguir mi envío?",
        answer: "Sí, una vez despachado tu pedido recibirás un email con el número de seguimiento. También podés rastrear tu envío desde la sección 'Mi Cuenta' > 'Mis Pedidos'.",
      },
    ],
  },
  {
    title: "Cambios y Devoluciones",
    items: [
      {
        question: "¿Puedo cambiar un producto?",
        answer: "Sí, podés cambiar productos dentro de los 30 días de recibida la compra. El producto debe estar sin uso, con todas sus etiquetas y en perfectas condiciones. Coordiná el cambio contactándonos.",
      },
      {
        question: "¿Cómo solicito una devolución?",
        answer: "Para solicitar una devolución, contactanos dentro de los 10 días de recibido el producto a través de nuestro formulario de contacto o WhatsApp. Te indicaremos los pasos a seguir.",
      },
      {
        question: "¿Cuánto tiempo demora el reembolso?",
        answer: "Una vez recibido el producto y verificado su estado, el reembolso se procesa en un plazo de 5 a 10 días hábiles. El tiempo exacto de depende tu entidad bancaria.",
      },
      {
        question: "¿Quién paga el envío en cambios/devoluciones?",
        answer: "Si el cambio o devolución es por defecto del producto, nosotros cubrimos el costo del envío. Si es por cambio de opinión, el costo corre por cuenta del cliente.",
      },
    ],
  },
  {
    title: "Cuenta y Pedidos",
    items: [
      {
        question: "¿Cómo creo una cuenta?",
        answer: "Hacé clic en 'Mi Cuenta' > 'Registrarse', completá tus datos y-confirmá tu email. También podés registrarte durante el proceso de compra.",
      },
      {
        question: "¿Cómo recupero mi contraseña?",
        answer: "En la página de login, hacé clic en 'Olvidé mi contraseña', ingresá tu email y te enviaremos un enlace para crear una nueva contraseña.",
      },
      {
        question: "¿Dónde veo mis pedidos anteriores?",
        answer: "Iniciá sesión y dirigite a 'Mi Cuenta' > 'Mis Pedidos'. Allí encontrarás el historial completo con el estado de cada pedido.",
      },
      {
        question: "¿Puedo modificar mi pedido después de realizado?",
        answer: "Una vez confirmado el pedido, no podemos modificarlo. Contactanos lo antes posible y we'll hacer nuestro mejor esfuerzo para ayudarte.",
      },
    ],
  },
  {
    title: "Productos Oficiales",
    items: [
      {
        question: "¿Son productos oficiales del club?",
        answer: "Sí, somos tienda oficial. Todos nuestros productos son originales y licenciados por el club. Contás con garantía oficial del fabricante.",
      },
      {
        question: "¿Tienen garantía los productos?",
        answer: "Sí cuentan con garantía oficial del fabricante por defectos de fabricación. El período de garantía varía según el, todos los productos producto.",
      },
      {
        question: "¿Puedo comprar mayorista?",
        answer: "Sí, tenemos precios especiales para compras mayoristas. Contactanos por email o WhatsApp para coordinar tu pedido.",
      },
    ],
  },
]

export function FAQContent() {
  return (
    <div className="space-y-8">
      {faqCategories.map((category) => (
        <div key={category.title}>
          <h2 className="text-xl font-semibold mb-4 text-primary">{category.title}</h2>
          <Accordion type="single" collapsible className="border rounded-lg">
            {category.items.map((item, index) => (
              <AccordionItem key={index} value={`${category.title}-${index}`}>
                <AccordionTrigger className="px-4 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}

      <div className="mt-8 p-6 bg-muted rounded-lg text-center">
        <h3 className="font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
        <p className="text-muted-foreground mb-4">
          Contactanos y te responderemos a la brevedad.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/542983000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Escribinos por WhatsApp
          </a>
          <a
            href="mailto:tienda@club.com"
            className="inline-flex items-center justify-center px-4 py-2 border border-input hover:bg-accent transition-colors bg-background rounded-lg"
          >
            Envianos un email
          </a>
        </div>
      </div>
    </div>
  )
}

