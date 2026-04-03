"use client"

import { useMemo } from "react"
import {
  CardPayment,
  initMercadoPago,
} from "@mercadopago/sdk-react"

type Props = {
  amount: number
  email: string
  onSubmit: (formData: any) => Promise<void>
  onReady?: () => void
  onError?: (error: any) => void
}

const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

if (publicKey) {
  initMercadoPago(publicKey, { locale: "es-AR" })
}

export function CardPaymentBrick({
  amount,
  email,
  onSubmit,
  onReady,
  onError,
}: Props) {
  const initialization = useMemo(
    () => ({
      amount,
      payer: {
        email,
      },
    }),
    [amount, email]
  )

  const customization = useMemo(
    () => ({
      paymentMethods: {
        maxInstallments: 12,
      },
      visual: {
        style: {
          theme: "default",
        },
      },
    }),
    []
  )

  if (!publicKey) {
    return (
      <p className="text-sm text-red-600">
        Falta configurar NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-muted-foreground">
        Completá los datos de la tarjeta en el formulario de Mercado Pago.
      </p>

      <div className="rounded-lg border p-3 bg-white">
        <CardPayment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      </div>
    </div>
  )
}