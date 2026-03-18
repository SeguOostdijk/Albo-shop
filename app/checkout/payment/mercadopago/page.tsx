interface MercadoPagoPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function MercadoPagoPage({ searchParams }: MercadoPagoPageProps) {
  const { orderId } = await searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Continuar con Mercado Pago</h1>
      <p className="text-muted-foreground mb-6">
        Pedido generado correctamente: <strong>{orderId}</strong>
      </p>

      <div className="rounded-lg border p-6">
        <p className="mb-4">
          Acá después vas a integrar la preferencia real de Mercado Pago.
        </p>

        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Ir a Mercado Pago
        </button>
      </div>
    </div>
  )
}