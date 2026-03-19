interface MercadoPagoPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function MercadoPagoPage({ searchParams }: MercadoPagoPageProps) {
  const { orderId } = await searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Continuar con Mercado Pago</h1>

      <p className="text-muted-foreground mb-6">
        Tu pedido fue generado correctamente. Vas a ser redirigido a Mercado Pago para completar el pago.
      </p>

      <div className="rounded-lg border p-6 space-y-4">
        <p>
          <strong>Número de pedido:</strong> {orderId}
        </p>

        <p className="text-sm text-muted-foreground">
          Al hacer clic en el botón, se abrirá Mercado Pago donde podrás pagar con:
        </p>

        <ul className="text-sm list-disc pl-5 text-muted-foreground">
          <li>Tarjeta de crédito o débito</li>
          <li>Saldo en cuenta</li>
          <li>Transferencia</li>
        </ul>

        {/* Botón principal */}
        <button
          className="w-full rounded-md bg-[var(--accent)] text-white py-2.5 text-sm font-medium hover:brightness-110 transition"
        >
          Ir a Mercado Pago
        </button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Una vez realizado el pago, se confirmará automáticamente tu pedido.
      </p>
    </div>
  )
}