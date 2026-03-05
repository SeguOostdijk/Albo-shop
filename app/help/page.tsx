import { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { HelpContent } from "./help-content"

export const metadata: Metadata = {
  title: "Centro de Ayuda",
  description: "Encontrá respuestas a tus preguntas y conocé nuestras políticas.",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[{ label: "Centro de Ayuda" }]}
      />

      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
        <p className="text-muted-foreground mb-8">
          ¿Cómo podemos ayudarte? Encontrá toda la información que necesitás.
        </p>

        <HelpContent />
      </div>
    </div>
  )
}

