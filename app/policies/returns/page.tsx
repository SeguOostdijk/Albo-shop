import { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ReturnsContent } from "./returns-content"

export const metadata: Metadata = {
  title: "Políticas de Cambios y Devoluciones",
  description: "Conocé nuestra política de cambios, devoluciones y reembolsos.",
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Ayuda", href: "/help" },
          { label: "Políticas de Cambios y Devoluciones" },
        ]}
      />

      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Políticas de Cambios y Devoluciones</h1>
        <p className="text-muted-foreground mb-8">
          Conocé nuestras políticas para cambios, devoluciones y reembolsos.
        </p>

        <ReturnsContent />
      </div>
    </div>
  )
}

