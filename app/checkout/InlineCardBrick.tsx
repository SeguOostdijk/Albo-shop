"use client"

import { useEffect, useRef, useState } from "react"

interface InlineCardBrickProps {
  amount: number
  email: string
  paymentType: "credit-card" | "debit-card"
  publicKey: string
  onPayment: (formData: unknown) => Promise<void>
  onBrickError: (msg: string) => void
}

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale: string }) => {
      bricks: () => {
        create: (
          brick: string,
          containerId: string,
          settings: object
        ) => Promise<{ unmount: () => void }>
      }
    }
  }
}

export function InlineCardBrick({
  amount,
  email,
  paymentType,
  publicKey,
  onPayment,
  onBrickError,
}: InlineCardBrickProps) {
  const brickRef = useRef<{ unmount: () => void } | null>(null)
  const [brickReady, setBrickReady] = useState(false)
  const containerId = "inlineCardBrick_container"

  useEffect(() => {
    const scriptId = "mp-sdk"

    const waitForConstructor = () =>
      new Promise<void>((resolve, reject) => {
        let attempts = 0
        const id = setInterval(() => {
          if (typeof window.MercadoPago === "function") { clearInterval(id); resolve() }
          if (++attempts > 100) { clearInterval(id); reject(new Error("SDK de MercadoPago no disponible")) }
        }, 50)
      })

    const init = async () => {
      if (!document.getElementById(scriptId)) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.id = scriptId
          script.src = "https://sdk.mercadopago.com/js/v2"
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("No se pudo cargar el SDK de MercadoPago"))
          document.head.appendChild(script)
        })
      }

      await waitForConstructor()

      const mp = new window.MercadoPago(publicKey, { locale: "es-AR" })
      const bricks = mp.bricks()

      const settings = {
        initialization: {
          amount,
          payer: { email },
        },
        customization: {
          visual: {
            style: { theme: "default" },
            hideFormTitle: true,
          },
          paymentMethods:
            paymentType === "credit-card"
              ? { creditCard: "all", maxInstallments: 12 }
              : { debitCard: "all", maxInstallments: 1 },
        },
        callbacks: {
          onReady: () => {
            setBrickReady(true)
          },
          onSubmit: async (formData: unknown) => {
            await onPayment(formData)
          },
          onError: (error: { type?: string } | unknown) => {
            const e = error as { type?: string }
            if (e?.type === "non_critical") return
            console.error("Brick critical error:", error)
            onBrickError("Ocurrió un error con el formulario de pago")
          },
        },
      }

      brickRef.current = await bricks.create("cardPayment", containerId, settings)
    }

    init().catch((err) => {
      console.error(err)
      onBrickError("No se pudo cargar el formulario de pago")
    })

    return () => {
      brickRef.current?.unmount()
    }
  }, [])

  return (
    <div>
      {!brickReady && (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary shrink-0" />
          <span>Cargando formulario de pago...</span>
        </div>
      )}

      {brickReady && (
        <p className="text-sm font-semibold mb-3">
          {paymentType === "credit-card" ? "Tarjeta de crédito" : "Tarjeta de débito"}
        </p>
      )}

      <div id={containerId} style={{ display: brickReady ? "block" : "none" }} />
    </div>
  )
}
