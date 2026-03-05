import { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ContactContent } from "./contact-content"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá con Club Shop - Estamos para ayudarte.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[{ label: "Contacto" }]}
      />

      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Contacto</h1>
        <p className="text-muted-foreground mb-8">
          ¿Tenés alguna pregunta? Estamos aquí para ayudarte.
        </p>

        <ContactContent />
      </div>
    </div>
  )
}

