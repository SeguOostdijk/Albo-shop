"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useAuthStore } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/currency"
import { toast } from "sonner"

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_image: string | null
  variant_color: string
  variant_size: string
  quantity: number
  unit_price: number
}

interface Order {
  id: string
  total: number
  status: string
  shipping_name: string | null
  shipping_address: string | null
  payment_status: string | null
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
  const { user, initialized } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (initialized && user) {
      fetchOrders()
    } else if (initialized && !user) {
      setLoading(false)
    }
  }, [initialized, user])

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          id,
          total,
          status,
          shipping_name,
          shipping_address,
          payment_status,
          created_at,
          items:order_items (
            id,
            product_id,
            product_name,
            product_image,
            variant_color,
            variant_size,
            quantity,
            unit_price
          )
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(ordersData || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Error al cargar los pedidos")
    } finally {
      setLoading(false)
    }
  }

  if (!initialized || loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Mi Cuenta", href: "/account" }, { label: "Mis Pedidos" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f2f98]"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Mi Cuenta", href: "/account" }, { label: "Mis Pedidos" }]} />
        <div className="max-w-md mx-auto mt-8 text-center">
          <Card>
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Iniciá sesión para ver tus pedidos</h2>
              <p className="text-muted-foreground mb-4">
                Necesitás estar conectado para acceder al historial de pedidos
              </p>
              <Button asChild className="bg-[#0f2f98] hover:bg-[#0a2475]">
                <Link href="/account/login">Iniciar Sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[
        { label: "Mi Cuenta", href: "/account" },
        { label: "Mis Pedidos" }
      ]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tenés pedidos aún</h2>
            <p className="text-muted-foreground mb-4">
              Cuando realices una compra, podrás ver el historial aquí
            </p>
            <Button asChild className="bg-[#0f2f98] hover:bg-[#0a2475]">
              <Link href="/">Ver Productos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusLabels[order.status] || { label: order.status, color: "bg-gray-500" }
            
            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg">Pedido #{order.id.slice(-8).toUpperCase()}</CardTitle>
                    <CardDescription>
                      {new Date(order.created_at).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} producto{order.items?.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
                    </div>
                    <Button variant="outline" asChild className="cursor-pointer">
                      <Link href={`/account/orders/${order.id}`}>
                        Ver Detalle
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
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

