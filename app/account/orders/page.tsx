"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import Image from "next/image"
import { Package, ChevronRight, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  total: number
  shippingCost: number
  shippingMethod: string
  created_at: string
  items: OrderItem[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-500" },
  processing: { label: "Procesando", color: "bg-blue-500" },
  shipped: { label: "Enviado", color: "bg-purple-500" },
  delivered: { label: "Entregado", color: "bg-green-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500" },
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if not authenticated
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
              Cuando realices una compra, tus pedidos apareceran aqui
            </p>
            <Button asChild>
              <Link href="/">Comenzar a Comprar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusLabels[order.status] || { label: order.status, color: "bg-gray-500" }
            
            return (
              <Card key={order.id}>
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id.slice(-8).toUpperCase()}</CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="font-semibold">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-20 h-20 rounded bg-muted flex-shrink-0">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.color} / {item.size} | Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Ver Detalles
                      <ChevronRight className="ml-2 h-4 w-4" />
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

