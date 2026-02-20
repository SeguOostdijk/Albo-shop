"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, RefreshCw, Ruler } from "lucide-react"

interface ProductInfoProps {
  description: string
}

export function ProductInfo({ description }: ProductInfoProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-4 pb-2"
        >
          Descripcion
        </TabsTrigger>
        <TabsTrigger
          value="sizes"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-4 pb-2"
        >
          Guia de Talles
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-4 pb-2"
        >
          Envios
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="pt-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Material: 100% Poliester reciclado</li>
          <li>Tecnologia Dri-FIT para mantener la piel seca</li>
          <li>Escudo del club bordado</li>
          <li>Etiqueta tejida de autenticidad</li>
          <li>Corte regular</li>
        </ul>
      </TabsContent>

      <TabsContent value="sizes" className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="h-5 w-5 text-secondary" />
          <span className="font-medium">Guia de Talles</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Talle</th>
                <th className="text-left py-2 pr-4">Pecho (cm)</th>
                <th className="text-left py-2 pr-4">Largo (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4">S</td>
                <td className="py-2 pr-4">96-101</td>
                <td className="py-2 pr-4">71</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">M</td>
                <td className="py-2 pr-4">101-106</td>
                <td className="py-2 pr-4">73</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">L</td>
                <td className="py-2 pr-4">106-111</td>
                <td className="py-2 pr-4">75</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">XL</td>
                <td className="py-2 pr-4">111-117</td>
                <td className="py-2 pr-4">77</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">XXL</td>
                <td className="py-2 pr-4">117-124</td>
                <td className="py-2 pr-4">79</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="pt-4 space-y-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-secondary mt-0.5" />
          <div>
            <h4 className="font-medium">Envios</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Envio gratis en compras mayores a $75.000. Envio express disponible
              en CABA y GBA con entrega en 24-48hs.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 text-secondary mt-0.5" />
          <div>
            <h4 className="font-medium">Cambios y Devoluciones</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Tenes 30 dias para realizar cambios o devoluciones. El producto debe
              estar sin uso y con todas las etiquetas originales.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
