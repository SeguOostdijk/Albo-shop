import { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { TermsContent } from "./terms-content"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de la tienda online.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[{ label: "Términos y Condiciones" }]
      />

      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Términos y Condiciones</h1>
        <p className="text-muted-foreground mb-8">
          Al utilizar nuestra tienda online, aceptás los siguientes términos y condiciones.
        </p>

        <TermsContent />
      </div>
    </div>
  )
}

