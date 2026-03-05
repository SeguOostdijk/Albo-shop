import { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { FAQContent } from "./faq-content"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Respondemos todas tus dudas sobre compras, envíos, pagos y más.",
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Ayuda", href: "/help" },
          { label: "Preguntas Frecuentes" },
        ]}
      />

      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Preguntas Frecuentes</h1>
        <p className="text-muted-foreground mb-8">
          Encontrá respuestas a las preguntas más comunes sobre nuestra tienda.
        </p>

        <FAQContent />
      </div>
    </div>
  )
}

