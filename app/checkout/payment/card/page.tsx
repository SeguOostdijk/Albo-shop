interface CardPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function CardPage({ searchParams }: CardPageProps) {
  const { orderId } = await searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Pago con tarjeta</h1>

      <p className="text-muted-foreground mb-6">
        Pedido generado correctamente: <strong>{orderId ?? "Sin ID"}</strong>
      </p>

      <div className="rounded-lg border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Completar datos de pago</h2>
          <p className="text-sm text-muted-foreground">
            Ingresá los datos de tu tarjeta para finalizar la compra.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cardName" className="text-sm font-medium">
              Nombre en la tarjeta
            </label>
            <input
              id="cardName"
              name="cardName"
              type="text"
              placeholder="JUAN PEREZ"
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cardNumber" className="text-sm font-medium">
              Número de tarjeta
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expiry" className="text-sm font-medium">
                Vencimiento
              </label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                placeholder="MM/AA"
                className="w-full rounded-md border px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </label>
              <input
                id="cvv"
                name="cvv"
                type="password"
                inputMode="numeric"
                placeholder="123"
                className="w-full rounded-md border px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dni" className="text-sm font-medium">
              DNI del titular
            </label>
            <input
              id="dni"
              name="dni"
              type="text"
              placeholder="12.345.678"
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-md bg-[var(--accent)] text-white py-2.5 text-sm font-medium hover:opacity-90"
            >
              Finalizar compra
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}