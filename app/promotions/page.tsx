import { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PromotionsContent } from "./promotions-content"

export const metadata: Metadata = {
  title: "Promociones",
  description: "Conocé las promociones vigentes y códigos de descuento disponibles.",
}

export default function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[{ label: "Promociones" }]
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Promociones y Ofertas</h1>
        <p className="text-muted-foreground mb-8">
          Encontrá las mejores ofertas y descuentos exclusivos.
        </p>

        <PromotionsContent />
      </div>
    </div>
  )
}

