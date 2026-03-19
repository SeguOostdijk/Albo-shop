import Link from "next/link"

interface TransferPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function TransferPage({ searchParams }: TransferPageProps) {
  const { orderId } = await searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Pago con tarjeta</h1>
      <p className="text-muted-foreground mb-6">
        Tu pedido fue generado correctamente. Ingresá los datos de tu tarjeta para completar el pago.
      </p>

      <form className="space-y-4 pt-4 border-t border-border mb-8">
        <div className="space-y-2">
          <label htmlFor="cardNumber">Numero de Tarjeta</label>
          <input
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            className="placeholder:text-muted-foreground/60 border rounded p-2 w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="expiry">Vencimiento</label>
            <input
              id="expiry"
              name="expiry"
              placeholder="MM/AA"
              className="placeholder:text-muted-foreground/60 border rounded p-2 w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              name="cvv"
              placeholder="123"
              className="placeholder:text-muted-foreground/60 border rounded p-2 w-full"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="cardName">Nombre en la Tarjeta</label>
          <input
            id="cardName"
            name="cardName"
            placeholder="JUAN PEREZ"
            className="placeholder:text-muted-foreground/60 border rounded p-2 w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="dni">DNI del titular</label>
          <input
            id="dni"
            name="dni"
            placeholder="12.345.678"
            className="placeholder:text-muted-foreground/60 border rounded p-2 w-full"
            required
          />
        </div>

        <button type="submit" className="w-full bg-primary text-white rounded p-2 mt-4">Pagar</button>
      </form>

      <div className="rounded-lg border p-6 space-y-2">
        <p><strong>Número de pedido:</strong> {orderId}</p>
        <p><strong>Banco:</strong> Banco de la Nacion Argentina</p>
        <p><strong>CBU:</strong> 0110464040046411693330</p>
        <p><strong>Nombre:</strong> Club Atletico Independiente de San Cayetano</p>
        <p><strong>CUIT:</strong> 30-70708050-3</p>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Una vez realizada la transferencia, envianos el comprobante por el canal indicado.
      </p>

      <div className="mt-6">
        <Link href="/account/orders" className="underline">
          Ver mis pedidos
        </Link>
      </div>
    </div>
  )
}
