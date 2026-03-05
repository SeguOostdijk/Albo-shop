import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const termsSections = [
  {
    title: "Información General",
    items: [
      {
        question: "Acerca de estos Términos",
        answer: "Estos Términos y Condiciones regulan la relación entre Club Shop (en adelante 'la Tienda') y los usuarios que accedan y/o utilicen el sitio web. El uso del sitio implica la aceptación plena y sin reservas de todas las disposiciones contenidas en estos términos.",
      },
      {
        question: "Modificaciones",
        answer: "La Tienda se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio. Es responsabilidad del usuario revisar periódicamente los términos actualizados.",
      },
    ],
  },
  {
    title: "Cuenta de Usuario",
    items: [
      {
        question: "Registro de Cuenta",
        answer: "Para realizar compras, podés crear una cuenta proporcionando información veraz y completa. Sos responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.",
      },
      {
        question: "Requisitos",
        answer: "Debés ser mayor de 18 años o contar con autorización de tus padres/tutores para utilizar nuestros servicios. Al registrarte, confirmás que cumplís con estos requisitos.",
      },
      {
        question: "Seguridad",
        answer: "La Tienda no será responsable por cualquier daño o perjuicio derivado del uso no autorizado de tu cuenta. Debés notificarnos inmediatamente sobre cualquier uso sospechoso de tu cuenta.",
      },
    ],
  },
  {
    title: "Compras y Pago",
    items: [
      {
        question: "Precios",
        answer: "Los precios de los productos están expresados en pesos argentinos e incluyen IVA. La Tienda se reserva el derecho de modificar precios en cualquier momento, pero los precios de productos já agregados al carrito no se verán afectados.",
      },
      {
        question: "Disponibilidad",
        answer: "Todos los productos están sujetos a disponibilidad. En caso de que un producto no esté disponible después de realizada la compra, te notificaremos y ofreceremos un reembolso completo.",
      },
      {
        question: "Medios de Pago",
        answer: "Aceptamos tarjetas de crédito y débito, Mercado Pago y transferencias bancarias. Todas las transacciones son procesadas de forma segura. No almacenamos información de tus tarjetas.",
      },
      {
        question: "Confirmación de Pedido",
        answer: "Recibirás un email de confirmación con los detalles de tu pedido. Este email no constituye aceptación de la oferta, sino confirmación de recepción.",
      },
    ],
  },
  {
    title: "Envíos",
    items: [
      {
        question: "Zona de Entrega",
        answer: "Realizamos envíos a todo el territorio argentino. Los tiempos de entrega varían según la ubicación y el método de envío seleccionado.",
      },
      {
        question: "Costos de Envío",
        answer: "El costo de envío es de $5.999 para compras menores a $75.000. Para compras superiores a ese monto, el envío es gratis.",
      },
      {
        question: "Riesgo de Pérdida",
        answer: "El riesgo de pérdida o daño de los productos pasa al cliente una vez entregado al transportista. Recomendamos verificar el estado del paquete al recibirlo.",
      },
    ],
  },
  {
    title: "Propiedad Intelectual",
    items: [
      {
        question: "Derechos de Autor",
        answer: "Todo el contenido del sitio, incluyendo textos, gráficos, logos, imágenes, código y software, es propiedad de la Tienda o sus licenciantes y está protegido por leyes de derechos de autor.",
      },
      {
        question: "Marcas Comerciales",
        answer: "Las marcas comerciales, logotipos y marcas de servicio mostrados en el sitio son propiedad de sus respectivos titulares. No podés usarlos sin autorización previa.",
      },
    ],
  },
  {
    title: "Privacidad",
    items: [
      {
        question: "Recopilación de Datos",
        answer: "Recopilamos información personal necesaria para procesar tus pedidos y mejorar nuestros servicios. Vos podés acceder, rectificar o suprimir tus datos contactándonos.",
      },
      {
        question: "Cookies",
        answer: "Utilizamos cookies para mejorar tu experiencia de navegación. Podés configurar tu navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades del sitio.",
      },
      {
        question: "Protección de Datos",
        answer: "Tu información personal es tratada de acuerdo a nuestra Política de Privacidad, которая cumple con la Ley de Protección de Datos Personales argentina (Ley 25.326).",
      },
    ],
  },
  {
    title: "Limitación de Responsabilidad",
    items: [
      {
        question: "Uso del Sitio",
        answer: "El sitio se proporciona 'tal cual' y 'según disponibilidad'. No garantizamos que el sitio sea ininterrumpido, seguro o libre de errores.",
      },
      {
        question: "Productos",
        answer: "No garantizamos que los productos cumplan con tus expectativas. Cualquier garantía sobre productos es quella provista por el fabricante.",
      },
      {
        question: "Daños",
        answer: "No seremos responsables por daños indirectos, incidentales, especiales o consecuentes derivados del uso del sitio o productos adquiridos.",
      },
    ],
  },
  {
    title: "Legislación Aplicable",
    items: [
      {
        question: "Jurisdicción",
        answer: "Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta por los tribunales ordinarios de la ciudad de San Cayetano, provincia de Buenos Aires.",
      },
      {
        question: "Contacto",
        answer: "Para cualquier consulta sobre estos términos, podés contactarnos a tienda@club.com o al +54 9 2983 000000.",
      },
    ],
  },
]

export function TermsContent() {
  return (
    <div className="space-y-8">
      <div className="bg-muted rounded-lg p-6">
        <p className="text-muted-foreground">
          <strong>Última actualización:</strong> Enero 2025
        </p>
        <p className="text-muted-foreground mt-2">
          Al acceder y utilizar Club Shop, aceptás estar vinculado por estos Términos y Condiciones. 
          Si no estás de acuerdo con alguna disposición, por favor no utilices nuestro sitio.
        </p>
      </div>

      <Accordion type="single" collapsible className="border rounded-lg">
        {termsSections.map((section, sectionIndex) => (
          <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
            <AccordionTrigger className="px-4 text-lg font-semibold">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-4 pt-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-b last:border-0 pb-4 last:pb-0">
                    <h4 className="font-medium mb-2">{item.question}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="bg-muted rounded-lg p-6">
        <h3 className="font-semibold mb-2">¿Tenés alguna pregunta?</h3>
        <p className="text-muted-foreground mb-4">
          Si necesitás más información sobre nuestros términos y condiciones, no dudes en contactarnos.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:tienda@club.com"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contactanos
          </a>
          <a
            href="/help/faq"
            className="inline-flex items-center justify-center px-4 py-2 border border-input hover:bg-accent transition-colors bg-background rounded-lg"
          >
            Preguntas Frecuentes
          </a>
        </div>
      </div>
    </div>
  )
}

