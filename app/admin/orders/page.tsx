"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowLeft, Truck, PackageCheck } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

function formatPrice(value: number | null | undefined) {
  if (value == null) return "-"
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value)
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

function getFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
) {
  return [firstName, lastName].filter(Boolean).join(" ") || "-"
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    dispatched: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  }
  const labels: Record<string, string> = {
    pending: "Pendiente",
    dispatched: "Despachado",
    delivered: "Entregado",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>
      {labels[status] ?? status}
    </span>
  )
}

type OrderItem = {
  id: number
  product_name: string
  price: number
  member_price: number | null
  quantity: number
  color: string
  size: string
  product_image: string | null
}

type Order = {
  id: number
  first_name: string
  last_name: string
  email: string
  member_number: string | null
  total: number
  status: string
  payment_method: string
  shipping_method: string
  shipping_cost: number
  created_at: string
  order_items: OrderItem[]
}

export default function AdminOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        first_name,
        last_name,
        email,
        member_number,
        total,
        status,
        payment_method,
        shipping_method,
        shipping_cost,
        created_at,
        order_items (
          id,
          product_name,
          price,
          member_price,
          quantity,
          color,
          size,
          product_image
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Error al cargar los pedidos")
    } else {
      setOrders(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    setUpdatingId(order.id)

    const res = await fetch("/api/admin/members/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        status: newStatus,
        email: order.email,
        firstName: order.first_name,
        shippingMethod: order.shipping_method,
      }),
    })

    if (!res.ok) {
      toast.error("Error al actualizar el pedido")
    } else {
      toast.success(
        newStatus === "dispatched" ? "Pedido marcado como despachado" : "Pedido marcado como entregado"
      )
      fetchOrders()
    }

    setUpdatingId(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-12 sm:pb-16 lg:pb-20">

      <div className="flex justify-start max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 text-sm font-semibold text-slate-600 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
      </div>

      <Card className="max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto border border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-blue-900 flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-black">
                Historial de pedidos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {orders.length} pedidos en total
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay pedidos registrados.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <details
                  key={order.id}
                  className="rounded-2xl border bg-white shadow-sm overflow-hidden"
                >
                  <summary className="cursor-pointer list-none p-4 sm:p-5 hover:bg-slate-50 transition">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                        <h3 className="text-lg font-bold">
                          {getFullName(order.first_name, order.last_name)}
                        </h3>
                        <p className="text-sm text-muted-foreground">{order.email ?? "-"}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fecha</p>
                          <p className="font-medium">{formatDate(order.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estado</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </div>
                  </summary>

                  <div className="border-t bg-slate-50/60 p-4 sm:p-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-muted-foreground mb-1">Método de pago</p>
                        <p className="font-medium">{order.payment_method ?? "-"}</p>
                      </div>
                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-muted-foreground mb-1">Envío</p>
                        <p className="font-medium">{order.shipping_method ?? "-"}</p>
                      </div>
                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-muted-foreground mb-1">Costo de envío</p>
                        <p className="font-medium">{formatPrice(order.shipping_cost)}</p>
                      </div>
                    </div>

                    {/* Botón de acción según estado y método de envío */}
                    {order.status === "pending" && (
                      <div className="flex justify-end">
                        {order.shipping_method === "pickup" ? (
                          <Button
                            size="sm"
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order, "delivered")}
                            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-xl cursor-pointer"
                          >
                            <PackageCheck className="h-4 w-4 mr-2" />
                            {updatingId === order.id ? "Actualizando..." : "Marcar como entregado"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateStatus(order, "dispatched")}
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl cursor-pointer"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            {updatingId === order.id ? "Actualizando..." : "Marcar como despachado"}
                          </Button>
                        )}
                      </div>
                    )}

                    <div>
                      <h4 className="text-base font-bold mb-3">Productos del pedido</h4>
                      {!order.order_items || order.order_items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Este pedido no tiene items cargados.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border bg-white">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100">
                              <tr className="text-left">
                                <th className="px-4 py-3 font-bold">Producto</th>
                                <th className="px-4 py-3 font-bold">Color</th>
                                <th className="px-4 py-3 font-bold">Talle</th>
                                <th className="px-4 py-3 font-bold">Cantidad</th>
                                <th className="px-4 py-3 font-bold">Precio</th>
                                <th className="px-4 py-3 font-bold">Precio socio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items.map((item) => (
                                <tr key={item.id} className="border-t">
                                  <td className="px-4 py-3 font-medium">{item.product_name ?? "-"}</td>
                                  <td className="px-4 py-3">{item.color ?? "-"}</td>
                                  <td className="px-4 py-3">{item.size ?? "-"}</td>
                                  <td className="px-4 py-3">{item.quantity ?? "-"}</td>
                                  <td className="px-4 py-3">{formatPrice(item.price)}</td>
                                  <td className="px-4 py-3">{formatPrice(item.member_price)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}