interface CardPageProps {
  searchParams: { orderId?: string }
}

export default function CardPage({ searchParams }: CardPageProps) {
  const { orderId } = searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Pago con tarjeta</h1>
      <p className="text-muted-foreground mb-6">
        Pedido generado correctamente: <strong>{orderId}</strong>
      </p>

      <div className="rounded-lg border p-6">
        <p>
          Acá después podés integrar la pasarela real para crédito/débito.
        </p>
      </div>
    </div>
  )
}