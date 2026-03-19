"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { ChevronDown, Package, Truck, CheckCircle, Clock, CreditCard, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  user_id: string | null
  email: string | null
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  created_at: string
}

const statusConfig = {
  pending: { label: 'Pendiente Pago', icon: CreditCard, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  paid: { label: 'Pagado', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  processing: { label: 'Procesando', icon: Clock, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Enviado', icon: Truck, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'Entregado', icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelado', icon: X, color: 'bg-red-100 text-red-800 border-red-200' }
} as const

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id
          user_id
          email
          status
          total
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
        return
      }
      
      setOrders(data || [])
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Update status error:', error)
    } else {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    }
  }

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(order => order.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Pedidos</h2>
          <p className="text-muted-foreground">Cambia el estado de pedidos y monitorea entregas</p>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setFilterStatus} value={filterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente Pago</SelectItem>
              <SelectItem value="paid">Pagado</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchOrders} variant="outline">
            <ChevronDown className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-semibold mb-2 text-muted-foreground">
                No hay pedidos {filterStatus !== 'all' && <span>({statusConfig[filterStatus as keyof typeof statusConfig]?.label})</span>}
              </h3>
              <p className="text-muted-foreground">
                Cuando lleguen pedidos aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-8 hover:bg-muted/50 group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg"># {order.id.slice(-8)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.email || 'Cliente registrado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Total: <span className="font-bold">$ {order.total.toLocaleString()}</span></span>
                        <span>Fecha: <span className="font-mono text-xs">{new Date(order.created_at).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[order.status]?.color}`}>
                        {statusConfig[order.status]?.icon ? React.createElement(statusConfig[order.status].icon) : null}
                        {statusConfig[order.status]?.label}
                      </div>
                      <Select onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}>
                        <SelectTrigger className="w-[160px] h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((status) => (
                            <SelectItem key={status} value={status}>
                              {statusConfig[status]?.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

