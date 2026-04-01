"use client"

import { useEffect, useState } from 'react'

interface MercadoPagoPageProps {
  searchParams: { orderId?: string }
}

export default function MercadoPagoPage({ searchParams }: MercadoPagoPageProps) {
  const [loading, setLoading] = useState(true)
  const orderId = searchParams.orderId

  useEffect(() => {
    const initMP = async () => {
      if (typeof window !== 'undefined') {
        const mpPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
        if (!mpPublicKey) {
          alert('Falta configuración de MercadoPago. Contacta al administrador.')
          return
        }

        // Fetch MP payment URL from API if not direct
        try {
          const res = await fetch(`/api/checkout/mp-init?orderId=${orderId}`)
          const data = await res.json()
          
          if (data.mpUrl) {
            window.location.href = data.mpUrl
          } else {
            setLoading(false)
          }
        } catch (error) {
          console.error('Error initializing MP:', error)
          setLoading(false)
        }
      }
    }

    initMP()
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirigiendo a Mercado Pago...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-destructive">Error en pago</h1>
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
        <p>No se pudo inicializar Mercado Pago para el pedido <strong>{orderId}</strong></p>
        <p className="text-sm text-destructive-foreground/80 mt-2">
          Verifica tu conexión o contacta soporte.
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <a href="/account/orders" className="flex-1 bg-card border text-center py-3 rounded-lg hover:bg-muted transition">
          Ver pedidos
        </a>
        <a href="/cart" className="flex-1 bg-primary text-primary-foreground text-center py-3 rounded-lg hover:brightness-105 transition">
          Nuevo pedido
        </a>
      </div>
    </div>
  )
}
