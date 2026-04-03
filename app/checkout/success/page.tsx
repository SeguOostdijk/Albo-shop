interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string
    status?: string
    statusDetail?: string
  }>
}

function getStatusData(status?: string, statusDetail?: string) {
  if (status === "approved") {
    return {
      title: "¡Pago realizado con éxito!",
      description: "Tu compra fue confirmada y el pago fue aprobado correctamente.",
      badge: "Aprobado",
      badgeClass: "bg-green-100 text-green-700",
      titleClass: "text-green-600",
    }
  }

  if (status === "pending" || status === "in_process") {
    return {
      title: "Compra registrada",
      description:
        "Tu pedido fue creado y el pago quedó pendiente de confirmación.",
      badge: "Pendiente",
      badgeClass: "bg-yellow-100 text-yellow-700",
      titleClass: "text-yellow-600",
    }
  }

  if (status === "rejected") {
    return {
      title: "Pago rechazado",
      description:
        statusDetail
          ? `No pudimos aprobar el pago: ${statusDetail}`
          : "No pudimos aprobar el pago. Probá nuevamente con otro medio.",
      badge: "Rechazado",
      badgeClass: "bg-red-100 text-red-700",
      titleClass: "text-red-600",
    }
  }

  return {
    title: "Pedido generado",
    description: "Tu pedido fue generado correctamente.",
    badge: "Procesando",
    badgeClass: "bg-slate-100 text-slate-700",
    titleClass: "text-slate-700",
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId, status, statusDetail } = await searchParams
  const statusData = getStatusData(status, statusDetail)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border bg-white shadow-sm p-8">
        <div className="mb-6">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusData.badgeClass}`}
          >
            {statusData.badge}
          </span>
        </div>

        <h1 className={`text-3xl sm:text-4xl font-black mb-4 ${statusData.titleClass}`}>
          {statusData.title}
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg mb-8">
          {statusData.description}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm text-muted-foreground mb-1">Número de pedido</p>
            <p className="text-lg font-bold">#{orderId ?? "-"}</p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm text-muted-foreground mb-1">Estado</p>
            <p className="text-lg font-bold capitalize">{status ?? "procesando"}</p>
          </div>
        </div>

        {statusDetail ? (
          <div className="rounded-xl border bg-slate-50 p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-1">Detalle</p>
            <p className="font-medium">{statusDetail}</p>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/account/orders"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] text-white px-5 py-3 font-semibold hover:opacity-90"
          >
            Ver mis pedidos
          </a>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-semibold hover:bg-muted"
          >
            Seguir comprando
          </a>
        </div>
      </div>
    </div>
  )
}