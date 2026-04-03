"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Lock, CreditCard, Truck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useCartStore } from "@/lib/cart-store"
import { useAuth } from "@/lib/auth-context"
import { formatCurrency } from "@/lib/currency"

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const [useMemberDiscount, setUseMemberDiscount] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberValidated, setMemberValidated] = useState(false)
  const [memberError, setMemberError] = useState("")
  const [validatingMember, setValidatingMember] = useState(false)
  const [province, setProvince] = useState("caba")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.user_metadata?.phone || user?.phone || "")

  const brickControllerRef = useRef<any>(null)

  const isCardPayment =
    paymentMethod === "credit-card" || paymentMethod === "debit-card"

  const getUnitPrice = (product: {
    price: number
    memberPrice?: number
  }) => {
    if (memberValidated && product.memberPrice) {
      return product.memberPrice
    }

    return product.price
  }

  const subtotalWithoutMemberDiscount = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
  }, [items])

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + getUnitPrice(item.product) * item.quantity
    }, 0)
  }, [items, memberValidated])

  const memberSavings = Math.max(0, subtotalWithoutMemberDiscount - subtotal)

  const shippingCost =
    shippingMethod === "express"
      ? 9999
      : shippingMethod === "pickup"
        ? 0
        : subtotal >= 75000
          ? 0
          : 5999

  const total = subtotal + shippingCost

  const handleValidateMember = async () => {
    setMemberError("")
    setMemberValidated(false)
    setValidatingMember(true)

    try {
      const res = await fetch("/api/validate-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberName }),
      })

      const json = await res.json()

      if (!json.ok || !json.valid) {
        setMemberError(json.message || "Nombre de socio inválido")
        setMemberValidated(false)
        return
      }

      setMemberValidated(true)
      toast.success("Nombre de socio validado")
    } catch {
      setMemberError("No se pudo validar el nombre de socio")
      setMemberValidated(false)
    } finally {
      setValidatingMember(false)
    }
  }

  useEffect(() => {
    if (!isCardPayment) {
      if (brickControllerRef.current?.unmount) {
        brickControllerRef.current.unmount()
        brickControllerRef.current = null
      }
      return
    }

    let cancelled = false

    async function loadBrick() {
      try {
        if (!document.getElementById("mp-sdk")) {
          const script = document.createElement("script")
          script.id = "mp-sdk"
          script.src = "https://sdk.mercadopago.com/js/v2"
          script.async = true
          document.body.appendChild(script)

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
          })
        }

        if (cancelled || !window.MercadoPago) return

        const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

        if (!publicKey) {
          console.error("Falta NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY")
          toast.error("Falta configurar Mercado Pago")
          return
        }

        const container = document.getElementById("cardPaymentBrick_container")
        if (!container) return

        const mp = new window.MercadoPago(publicKey, {
          locale: "es-AR",
        })

        const bricksBuilder = mp.bricks()

        if (brickControllerRef.current?.unmount) {
          await brickControllerRef.current.unmount()
          brickControllerRef.current = null
        }

        brickControllerRef.current = await bricksBuilder.create(
          "cardPayment",
          "cardPaymentBrick_container",
          {
            initialization: {
              amount: total,
              payer: {
                email,
              },
            },
            customization: {
              visual: {
                style: {
                  theme: "default",
                },
              },
              paymentMethods: {
                maxInstallments: 12,
              },
            },
            callbacks: {
              onReady: () => {
                console.log("Mercado Pago Brick listo")
              },
              onSubmit: async (formData: any) => {
                try {
                  setIsLoading(true)

                  const firstNameInput = document.getElementById("firstName") as HTMLInputElement | null
                  const lastNameInput = document.getElementById("lastName") as HTMLInputElement | null
                  const addressInput = document.getElementById("address") as HTMLInputElement | null
                  const cityInput = document.getElementById("city") as HTMLInputElement | null
                  const postalCodeInput = document.getElementById("postalCode") as HTMLInputElement | null
                  const emailInput = document.getElementById("email") as HTMLInputElement | null

                  const firstName = firstNameInput?.value?.trim() || ""
                  const lastName = lastNameInput?.value?.trim() || ""
                  const address = addressInput?.value?.trim() || ""
                  const city = cityInput?.value?.trim() || ""
                  const postalCode = postalCodeInput?.value?.trim() || ""
                  const emailValue = emailInput?.value?.trim() || email || ""

                  if (
                    !emailValue ||
                    !phone ||
                    !firstName ||
                    !lastName ||
                    !address ||
                    !city ||
                    !province ||
                    !postalCode
                  ) {
                    toast.error("Completá los datos obligatorios antes de pagar.")
                    setIsLoading(false)
                    return
                  }

                  const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      items,
                      email: emailValue,
                      phone: phone || "",
                      firstName,
                      lastName,
                      address,
                      city,
                      province,
                      postalCode,
                      shippingMethod,
                      shippingCost,
                      total,
                      paymentInfo: {
                        method: paymentMethod,
                        mpCardData: formData,
                      },
                      memberName: memberValidated ? memberName.trim() : null,
                      memberValidated,
                    }),
                  })

                  const data = await response.json()
                  console.log("Card checkout response:", data)

                  if (!data.success) {
                    toast.error(data.error || "Error al procesar el pago.")
                    setIsLoading(false)
                    return
                  }

                  clearCart()
                  toast.success("Pedido creado correctamente")

                  if (data.redirectTo) {
                    window.location.href = data.redirectTo
                    return
                  }

                  window.location.href = "/account/orders"
                } catch (error) {
                  console.error("Card checkout error:", error)
                  toast.error("Error al procesar el pago.")
                  setIsLoading(false)
                }
              },
              onError: (error: any) => {
                console.error("Mercado Pago Brick error:", error)
                toast.error("No se pudo cargar el formulario de tarjeta")
              },
            },
          }
        )
      } catch (error) {
        console.error("Error loading Mercado Pago Brick:", error)
        toast.error("No se pudo inicializar el formulario de tarjeta")
      }
    }

    loadBrick()

    return () => {
      cancelled = true
    }
  }, [
    isCardPayment,
    total,
    email,
    phone,
    items,
    province,
    shippingMethod,
    shippingCost,
    memberValidated,
    memberName,
    paymentMethod,
    clearCart,
  ])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isCardPayment) {
      toast.error("Completá el pago desde el formulario de tarjeta.")
      return
    }

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const emailValue = formData.get("email") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const postalCode = formData.get("postalCode") as string

    const paymentInfo = {
      method: paymentMethod,
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          email: emailValue,
          phone: phone || "",
          firstName,
          lastName,
          address,
          city,
          province,
          postalCode,
          shippingMethod,
          shippingCost,
          total,
          paymentInfo,
          memberName: memberValidated ? memberName.trim() : null,
          memberValidated,
        }),
      })

      const data = await response.json()
      console.log("Checkout response:", data)

      if (!data.success) {
        toast.error(data.error || "Error al procesar el pedido. Intenta nuevamente.")
        return
      }

      clearCart()

      if (paymentMethod === "mercadopago" && data.mpUrl) {
        toast.success("Pedido creado! Redirigiendo a MercadoPago...")
        window.location.href = data.mpUrl
        return
      }

      toast.success("Pedido creado correctamente")

      if (data.redirectTo) {
        window.location.href = data.redirectTo
        return
      }

      window.location.href = "/account/orders"
    } catch {
      toast.error("Error al procesar el pago. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito esta vacio</h1>
          <p className="text-muted-foreground mb-8">
            Agrega productos a tu carrito para continuar con el checkout
          </p>
          <Button asChild>
            <Link href="/category/hombre">Explorar Productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Carrito", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <Link
        href="/cart"
        className="inline-flex items-center text-sm text-secondary hover:underline mt-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al carrito
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Informacion de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {user ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="placeholder:text-muted-foreground/60 bg-muted cursor-not-allowed"
                      value={user?.email || ""}
                      readOnly
                      required
                    />
                  ) : (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="placeholder:text-muted-foreground/60"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    className={
                      user && phone
                        ? "placeholder:text-muted-foreground/60 bg-muted cursor-not-allowed"
                        : "placeholder:text-muted-foreground/60"
                    }
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!!user && !!phone}
                    required
                  />
                </div>
              </div>

              {user ? (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Datos cargados automáticamente
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-auto cursor-pointer"
                    onClick={() => window.open("/account/profile", "_blank")}
                  >
                    Cambiar Datos
                  </Button>
                </div>
              ) : null}
            </section>

            <section className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold">Direccion de Envio</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Juan"
                    className="placeholder:text-muted-foreground/60"
                    defaultValue={user?.user_metadata?.first_name || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Perez"
                    className="placeholder:text-muted-foreground/60"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Direccion</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                    className="placeholder:text-muted-foreground/60"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Buenos Aires"
                    className="placeholder:text-muted-foreground/60"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger id="province" className="cursor-pointer">
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caba">CABA</SelectItem>
                      <SelectItem value="buenosaires">Buenos Aires</SelectItem>
                      <SelectItem value="cordoba">Cordoba</SelectItem>
                      <SelectItem value="santafe">Santa Fe</SelectItem>
                      <SelectItem value="mendoza">Mendoza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Codigo Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="1000"
                    className="placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Metodo de Envio</h3>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer hover:text-primary transition-colors">
                        <span className="font-medium text-green-700">Retirar en Local</span>
                        <span className="text-sm text-muted-foreground block">
                          Retiralo gratis en Av. Rivadavia 4700
                        </span>
                      </Label>
                    </div>
                    <span className="font-medium text-success">Gratis</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="cursor-pointer hover:text-primary transition-colors">
                        <span className="font-medium">Envio Estandar</span>
                        <span className="text-sm text-muted-foreground block">
                          5-7 dias habiles
                        </span>
                      </Label>
                    </div>
                    <span className="font-medium">
                      {subtotal >= 75000 ? "Gratis" : formatCurrency(5999)}
                    </span>
                  </div>
                </RadioGroup>
              </div>
            </section>

            <section className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Beneficio de socio</h2>

              <div className="rounded-lg border border-border p-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useMemberDiscount}
                    onChange={(e) => {
                      setUseMemberDiscount(e.target.checked)
                      if (!e.target.checked) {
                        setMemberName("")
                        setMemberValidated(false)
                        setMemberError("")
                      }
                    }}
                  />
                  Aplicar descuento de socio
                </label>

                {useMemberDiscount && (
                  <div className="space-y-3">
                    <div>
                      <Input
                        id="memberName"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Ej: Perez Juan"
                        className="mt-2"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleValidateMember}
                      disabled={validatingMember || memberName.trim() === ""}
                    >
                      {validatingMember ? "Validando..." : "Validar nombre de socio"}
                    </Button>

                    {memberValidated && (
                      <p className="text-sm text-green-600">
                        Nombre válido. Se aplicó el precio de socio.
                      </p>
                    )}

                    {memberError && (
                      <p className="text-sm text-red-600">{memberError}</p>
                    )}

                    <a
                      href="https://wa.me/5491123456789?text=Hola,%20quiero%20hacerme%20socio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary underline"
                    >
                      ¿No sos socio? Hacete socio
                    </a>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold">Informacion de Pago</h2>
              </div>

              <div className="space-y-2 mb-6">
                <Label className="text-sm font-medium">Metodo de Pago</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-2 gap-2"
                >
                  <label
                    htmlFor="credit-card"
                    className={`cursor-pointer p-3 border rounded-lg flex items-center gap-2 transition-all ${
                      paymentMethod === "credit-card"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="credit-card" id="credit-card" className="sr-only" />
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Credito</span>
                  </label>

                  <label
                    htmlFor="debit-card"
                    className={`cursor-pointer p-3 border rounded-lg flex items-center gap-2 transition-all ${
                      paymentMethod === "debit-card"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="debit-card" id="debit-card" className="sr-only" />
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Debito</span>
                  </label>

                  <label
                    htmlFor="mercadopago"
                    className={`cursor-pointer p-3 border rounded-lg flex items-center gap-2 transition-all ${
                      paymentMethod === "mercadopago"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="mercadopago" id="mercadopago" className="sr-only" />
                    <span className="text-sm font-medium text-[#00B4E6]">MercadoPago</span>
                  </label>

                  <label
                    htmlFor="transfer"
                    className={`cursor-pointer p-3 border rounded-lg flex items-center gap-2 transition-all ${
                      paymentMethod === "transfer"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="transfer" id="transfer" className="sr-only" />
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm font-medium">Transferencia</span>
                  </label>
                </RadioGroup>
              </div>

              {isCardPayment && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Completá los datos de la tarjeta en el formulario de Mercado Pago.
                  </p>
                  <div id="cardPaymentBrick_container" />
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Tus datos estan protegidos con encriptacion SSL</span>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

              {memberValidated && memberSavings > 0 && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-700">
                    Precio socio aplicado
                  </p>
                  <p className="text-xs text-green-600">
                    Ahorrás {formatCurrency(memberSavings)} en tus productos
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const unitPrice = getUnitPrice(item.product)
                  const lineTotal = unitPrice * item.quantity
                  const originalLineTotal = item.product.price * item.quantity
                  const hasMemberDiscount =
                    memberValidated &&
                    !!item.product.memberPrice &&
                    item.product.memberPrice < item.product.price

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-16 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedColor} / {item.selectedSize}
                        </p>

                        {hasMemberDiscount ? (
                          <div className="mt-1">
                            <p className="text-xs text-muted-foreground line-through">
                              {formatCurrency(originalLineTotal)}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {formatCurrency(lineTotal)}
                            </p>
                            <p className="text-[11px] text-green-600">
                              Precio socio
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(lineTotal)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3 text-sm border-t border-border pt-4">
                {memberValidated && memberSavings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal original</span>
                    <span className="line-through text-muted-foreground">
                      {formatCurrency(subtotalWithoutMemberDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {memberValidated && memberSavings > 0 ? "Subtotal con socio" : "Subtotal"}
                  </span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {memberValidated && memberSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Ahorro socio</span>
                    <span>-{formatCurrency(memberSavings)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envio</span>
                  {shippingCost === 0 ? (
                    <span className="text-success">Gratis</span>
                  ) : (
                    <span>{formatCurrency(shippingCost)}</span>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {!isCardPayment && (
                <Button
                  type="submit"
                  className="w-full mt-6 cursor-pointer"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Procesando..."
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pagar {formatCurrency(total)}
                    </>
                  )}
                </Button>
              )}

              {isCardPayment && (
                <p className="text-sm text-muted-foreground text-center mt-6">
                  Completá el formulario de tarjeta de arriba para finalizar el pago.
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center mt-4">
                Al completar tu compra, aceptas nuestros{" "}
                <a href="/terms" className="underline">
                  Terminos y Condiciones
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}