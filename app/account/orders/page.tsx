"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Package, ChevronRight, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuth } from "@/lib/auth-context"
import { formatCurrency } from "@/lib/currency"

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string | null
  quantity: number
  price: number
  color: string
  size: string
}

interface Order {
  id: string
  status: string
  shippingStatus: string
  paymentMethod: string
  total: number
  shippingCost: number
  shippingMethod: string
  created_at: string
  items: OrderItem[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-500" },
  paid: { label: "Pagado", color: "bg-green-500" },
  in_process: { label: "En proceso", color: "bg-blue-500" },
  payment_failed: { label: "Pago fallido", color: "bg-red-500" },
  processing: { label: "Procesando", color: "bg-blue-500" },
  shipped: { label: "Enviado", color: "bg-purple-500" },
  delivered: { label: "Entregado", color: "bg-green-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500" },
}

const shippingStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-500" },
  dispatched: { label: "Despachado", color: "bg-blue-500" },
  delivered: { label: "Entregado", color: "bg-green-500" },
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        setOrders(data.orders || [])
      }
    } catch {
      toast.error("Error al cargar los pedidos")
    } finally {
      setLoading(false)
    }
  }

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Mi Cuenta", href: "/account" },
            { label: "Mis Pedidos" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Mi Cuenta", href: "/account" },
          { label: "Mis Pedidos" },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Aún no tienes pedidos</h2>
            <p className="text-muted-foreground mb-6">
              Cuando realices una compra, tus pedidos aparecerán aquí
            </p>
            <Button asChild>
              <Link href="/">Comenzar a Comprar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status =
              statusLabels[order.status] || {
                label: order.status,
                color: "bg-gray-500",
              }

            const shippingStatus =
              shippingStatusLabels[order.shippingStatus] || {
                label: order.shippingStatus,
                color: "bg-gray-500",
              }

            const orderId = String(order.id)
            const orderCode = orderId.slice(-8).toUpperCase()
            const isOpen = !!openOrders[orderId]

            return (
              <Card key={orderId}>
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{orderCode}
                      </CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-4">
                      {order.paymentMethod === "transfer" ? (
                        <span className="px-3 py-1 rounded-full text-xs text-white bg-yellow-500">
                          Pendiente de pago
                        </span>
                      ) : order.status === "paid" ? (
                        <span className="px-3 py-1 rounded-full text-xs text-white bg-green-500">
                          Pagado
                        </span>
                      ) : null}
                      <span className="font-semibold">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cantidad de productos</p>
                      <p className="font-medium">{order.items?.length || 0}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Envío</p>
                      <p className="font-medium">
                        {order.shippingMethod === "pickup"
                          ? "Recoger en local"
                          : order.shippingMethod === "standard"
                          ? "Envío estándar"
                          : order.shippingMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Costo de envío</p>
                      <p className="font-medium">
                        {formatCurrency(order.shippingCost)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Estado del envío</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs text-white ${shippingStatus.color}`}>
                        {shippingStatus.label}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-20 h-20 rounded bg-muted flex-shrink-0 overflow-hidden">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {item.productName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.color} / {item.size}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Cantidad: {item.quantity}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toggleOrder(orderId)}
                    >
                      {isOpen ? "Ocultar Detalles" : "Ver Detalles"}
                      <ChevronRight
                        className={`ml-2 h-4 w-4 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}