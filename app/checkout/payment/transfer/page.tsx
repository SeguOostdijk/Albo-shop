import Link from "next/link"
import CopyCbuButton from "./copy-cbu-button"

interface TransferPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function TransferPage({ searchParams }: TransferPageProps) {
  const { orderId } = await searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Pago por transferencia</h1>

      <p className="text-muted-foreground mb-6">
        Tu pedido fue generado correctamente. Realizá la transferencia con los datos
        que figuran abajo.
      </p>

      {/* Datos bancarios */}
      <div className="rounded-lg border p-6 space-y-2 mb-6">
        <p><strong>Número de pedido:</strong> {orderId}</p>
        <p><strong>Banco:</strong> Banco de la Nación Argentina</p>
        <p><strong>CBU:</strong> 0110464040046411693330</p>
        <p><strong>Alias:</strong> ALBO.SHOP</p>
        <p><strong>Nombre:</strong> Club Atlético Independiente de San Cayetano</p>
        <p><strong>CUIT:</strong> 30-70708050-3</p>
      </div>

      <CopyCbuButton />

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Una vez realizada la transferencia, enviá el comprobante a{" "}
        <strong>alboshopcai@gmail.com</strong> indicando tu número de pedido.
      </p>

      <div className="mt-6 text-center">
        <Link href="/account/orders" className="underline">
          Ver mis pedidos
        </Link>
      </div>
    </div>
  )
}