"use client"

import { useEffect, useRef, useState } from "react"

interface CardPaymentBrickProps {
  orderId: string
  amount: number
  email: string
  paymentType: "credit-card" | "debit-card"
  publicKey: string
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

export function CardPaymentBrick({
  orderId,
  amount,
  email,
  paymentType,
  publicKey,
}: CardPaymentBrickProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "processing" | "success" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const brickRef = useRef<{ unmount: () => void } | null>(null)
  const containerRef = useRef<string>("cardPaymentBrick_container")

  useEffect(() => {
    const scriptId = "mp-sdk"

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

      const mp = new window.MercadoPago(publicKey, { locale: "es-AR" })
      const bricks = mp.bricks()

      const settings = {
        initialization: {
          amount,
          payer: { email },
        },
        customization: {
          visual: { style: { theme: "default" } },
          paymentMethods:
            paymentType === "credit-card"
              ? { creditCard: "all", maxInstallments: 12 }
              : { debitCard: "all", maxInstallments: 1 },
        },
        callbacks: {
          onReady: () => setStatus("ready"),
          onSubmit: async (cardFormData: unknown) => {
            setStatus("processing")
            try {
              const res = await fetch("/api/checkout/card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, formData: cardFormData }),
              })
              const data = await res.json()

              if (data.success) {
                setStatus("success")
                window.location.href = data.redirectTo
              } else {
                setStatus("error")
                setErrorMsg(data.error ?? "El pago fue rechazado")
              }
            } catch {
              setStatus("error")
              setErrorMsg("Error al procesar el pago")
            }
          },
          onError: (error: unknown) => {
            console.error("Brick error:", error)
            setStatus("error")
            setErrorMsg("Ocurrió un error con el formulario de pago")
          },
        },
      }

      brickRef.current = await bricks.create("cardPayment", containerRef.current, settings)
    }

    init().catch((err) => {
      console.error(err)
      setStatus("error")
      setErrorMsg("No se pudo cargar el formulario de pago")
    })

    return () => {
      brickRef.current?.unmount()
    }
  }, [])

  return (
    <div>
      {status === "loading" && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {status === "processing" && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Procesando pago...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Pago aprobado. Redirigiendo...</p>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-4">
          <p className="text-sm font-medium text-destructive">{errorMsg}</p>
          <button
            className="mt-3 text-sm underline text-destructive"
            onClick={() => {
              setStatus("loading")
              setErrorMsg("")
              brickRef.current?.unmount()
            }}
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      <div
        id={containerRef.current}
        style={{ display: status === "ready" || status === "loading" ? "block" : "none" }}
      />
    </div>
  )
}
