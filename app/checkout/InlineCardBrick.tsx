"use client"

import { useEffect, useRef } from "react"

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

const CONTAINER_ID = "inlineCardBrick_container"

const loadMPSDK = (): Promise<void> => {
  const scriptId = "mp-sdk"
  const existing = document.getElementById(scriptId)

  if (existing) {
    if (typeof window.MercadoPago === "function") return Promise.resolve()
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar el SDK de MercadoPago")))
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://sdk.mercadopago.com/js/v2"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("No se pudo cargar el SDK de MercadoPago"))
    document.head.appendChild(script)
  })
}

export function InlineCardBrick({
  amount,
  email,
  paymentType,
  publicKey,
  onPayment,
  onBrickError,
}: InlineCardBrickProps) {
  const controllerRef = useRef<{ unmount: () => void } | null>(null)

  useEffect(() => {
    let active = true

    const init = async () => {
      await loadMPSDK()
      if (!active) return

      const mp = new window.MercadoPago(publicKey, { locale: "es-AR" })
      const bricks = mp.bricks()

      const controller = await bricks.create("cardPayment", CONTAINER_ID, {
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
          onReady: () => {},
          onSubmit: async (formData: unknown) => {
            await onPayment(formData)
          },
          onError: (error: unknown) => {
            const e = error as { type?: string }
            const silentTypes = ["non_critical", "validation_error", "card_error", "validation"]
            if (e?.type && silentTypes.includes(e.type)) return
            console.error("Brick error:", error)
            onBrickError("Ocurrió un error con el formulario de pago")
          },
        },
      })

      if (!active) {
        try { controller.unmount() } catch {}
        return
      }

      controllerRef.current = controller
    }

    init().catch((err) => {
      console.error(err)
      if (active) onBrickError("No se pudo cargar el formulario de pago")
    })

    return () => {
      active = false
      try {
        controllerRef.current?.unmount()
      } catch {}
      controllerRef.current = null
      const container = document.getElementById(CONTAINER_ID)
      if (container) container.innerHTML = ""
    }
  }, [])

  return (
    <div>
      <p className="text-sm font-semibold mb-3">
        {paymentType === "credit-card" ? "Tarjeta de crédito" : "Tarjeta de débito"}
      </p>
      <div id={CONTAINER_ID} />
    </div>
  )
}
