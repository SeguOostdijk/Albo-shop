"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Lock, CreditCard, Truck, Check, ChevronDown, Pencil } from "lucide-react"
import { InlineCardBrick } from "./InlineCardBrick"
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

const PROVINCES: Record<string, string> = {
  caba: "CABA",
  buenosaires: "Buenos Aires",
  cordoba: "Córdoba",
  santafe: "Santa Fe",
  mendoza: "Mendoza",
}

const PAYMENT_LABELS: Record<string, string> = {
  "credit-card": "Tarjeta de crédito",
  "debit-card": "Tarjeta de débito",
  mercadopago: "MercadoPago",
  transfer: "Transferencia bancaria",
}

const SHIPPING_LABELS: Record<string, string> = {
  pickup: "Retiro en local (gratis)",
  standard: "Envío estándar (5-7 días hábiles)",
}

type Step = 1 | 2 | 3

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const { user } = useAuth()

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [doneSteps, setDoneSteps] = useState<Set<Step>>(new Set())

  // Contact
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.user_metadata?.phone || user?.phone || "")

  // Shipping
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "")
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("caba")
  const [postalCode, setPostalCode] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [memberName, setMemberName] = useState("")
  const [memberValidated, setMemberValidated] = useState(false)
  const [memberError, setMemberError] = useState("")
  const [validatingMember, setValidatingMember] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [transferInfo, setTransferInfo] = useState<{ orderId: number } | null>(null)

  const isCard = paymentMethod === "credit-card" || paymentMethod === "debit-card"
  const mpPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? ""

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
  }

  // Pricing
  const getUnitPrice = (product: { price: number; memberPrice?: number }) =>
    memberValidated && product.memberPrice ? product.memberPrice : product.price

  const subtotalWithoutMemberDiscount = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + getUnitPrice(item.product) * item.quantity, 0),
    [items, memberValidated]
  )

  const memberSavings = Math.max(0, subtotalWithoutMemberDiscount - subtotal)

  const shippingCost =
    shippingMethod === "pickup" ? 0 : subtotal >= 75000 ? 0 : 5999

  const total = subtotal + shippingCost

  // Step helpers
  const markDone = (step: Step, next: Step) => {
    setDoneSteps((prev) => new Set([...prev, step]))
    setCurrentStep(next)
  }

  const editStep = (step: Step) => {
    setDoneSteps((prev) => {
      const next = new Set(prev)
      next.delete(step)
      // Also un-complete subsequent steps
      if (step <= 2) next.delete((step + 1) as Step)
      if (step === 1) next.delete(3)
      return next
    })
    setCurrentStep(step)
  }

  // Validators
  const handleContinueContact = () => {
    if (!email.trim() || !phone.trim()) {
      toast.error("Completá todos los campos de contacto")
      return
    }
    markDone(1, 2)
  }

  const handleContinueShipping = () => {
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      toast.error("Completá todos los campos de envío")
      return
    }
    markDone(2, 3)
  }

  const handleContinuePayment = () => {
    markDone(3, 3)
  }

  const handleValidateMember = async () => {
    setMemberError("")
    setMemberValidated(false)
    setValidatingMember(true)
    try {
      const res = await fetch("/api/validate-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberName }),
      })
      const json = await res.json()
      if (!json.ok || !json.valid) {
        setMemberError("Nombre de socio inválido")
        return
      }
      setMemberValidated(true)
      toast.success("Número de socio validado")
    } catch {
      setMemberError("No se pudo validar el número de socio")
    } finally {
      setValidatingMember(false)
    }
  }

  const buildOrderBody = () => ({
    items,
    email,
    phone,
    firstName,
    lastName,
    address,
    city,
    province,
    postalCode,
    shippingMethod,
    shippingCost,
    total,
    paymentInfo: { method: paymentMethod },
    memberName: memberValidated ? memberName.trim() : null,
    memberValidated,
  })

  const handleCardPayment = async (formData: unknown) => {
    setIsLoading(true)
    try {
      // 1. Crear el pedido
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildOrderBody()),
      })
      const orderData = await orderRes.json()
      if (!orderData.success) {
        toast.error(orderData.error || "Error al crear el pedido")
        setIsLoading(false)
        return
      }

      // 2. Procesar el pago con el token del Brick
      const payRes = await fetch("/api/checkout/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId, formData }),
      })
      const payData = await payRes.json()

      if (payData.success) {
        clearCart()
        window.location.href = payData.redirectTo ?? "/account/orders"
      } else {
        toast.error(payData.error || "El pago fue rechazado")
        setIsLoading(false)
      }
    } catch {
      toast.error("Error al procesar el pago")
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!doneSteps.has(1) || !doneSteps.has(2)) {
      toast.error("Completá todos los pasos antes de continuar")
      return
    }

    if (isCard) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildOrderBody()),
      })
      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || "Error al procesar el pedido. Intenta nuevamente.")
        return
      }

      clearCart()

      // Transferencia: mostrar datos bancarios inline
      if (paymentMethod === "transfer") {
        setTransferInfo({ orderId: data.orderId })
        return
      }

      // MercadoPago: redirigir al checkout de MP
      if (data.mpUrl) { window.location.href = data.mpUrl; return }
      if (data.redirectTo) { window.location.href = data.redirectTo; return }
      window.location.href = "/account/orders"
    } catch {
      toast.error("Error al procesar el pago. Intenta nuevamente.")
    } finally {
      if (paymentMethod !== "transfer") setIsLoading(false)
    }
  }

  if (items.length === 0 && !transferInfo) {
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

  if (transferInfo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Pago por transferencia</h1>
          <p className="text-muted-foreground mb-6">
            Tu pedido fue generado correctamente. Realizá la transferencia con los datos que figuran abajo.
          </p>
          <div className="rounded-lg border p-6 space-y-2 mb-6">
            <p><strong>Número de pedido:</strong> {transferInfo.orderId}</p>
            <p><strong>Banco:</strong> Banco de la Nación Argentina</p>
            <p><strong>CBU:</strong> 0110464040046411693330</p>
            <p><strong>Alias:</strong> ALBO.SHOP</p>
            <p><strong>Nombre:</strong> Club Atlético Independiente de San Cayetano</p>
            <p><strong>CUIT:</strong> 30-70708050-3</p>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText("0110464040046411693330").then(() => toast.success("CBU copiado")).catch(() => toast.error("No se pudo copiar"))}
            className="w-full mb-4 rounded-md border py-2 text-sm"
          >
            Copiar CBU
          </button>
          <p className="text-sm text-muted-foreground text-center">
            Una vez realizada la transferencia, enviá el comprobante a{" "}
            <strong>alboshopcai@gmail.com</strong> indicando tu número de pedido.
          </p>
          <div className="mt-6 text-center">
            <Link href="/account/orders" className="underline">Ver mis pedidos</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Carrito", href: "/cart" }, { label: "Checkout" }]} />

      <Link href="/cart" className="inline-flex items-center text-sm text-secondary hover:underline mt-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al carrito
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">

          {/* ── STEP 1: Contacto ── */}
          <StepCard
            number={1}
            title="Información de Contacto"
            icon={<span className="text-base">✉️</span>}
            isOpen={currentStep === 1}
            isDone={doneSteps.has(1)}
            onEdit={() => editStep(1)}
            summary={
              doneSteps.has(1)
                ? <p className="text-sm text-muted-foreground">{email} · {phone}</p>
                : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
<Button type="button" className="mt-5 cursor-pointer" onClick={handleContinueContact}>
              Continuar
            </Button>
          </StepCard>

          {/* ── STEP 2: Envío ── */}
          <StepCard
            number={2}
            title="Dirección de Envío"
            icon={<Truck className="h-4 w-4" />}
            isOpen={currentStep === 2}
            isDone={doneSteps.has(2)}
            isLocked={!doneSteps.has(1) && currentStep !== 2}
            onEdit={() => editStep(2)}
            summary={
              doneSteps.has(2)
                ? (
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>{firstName} {lastName}</p>
                    <p>{address}, {city}, {PROVINCES[province]}, CP {postalCode}</p>
                    <p>{SHIPPING_LABELS[shippingMethod]}</p>
                  </div>
                )
                : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Juan" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input placeholder="Perez" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Dirección</Label>
                <Input placeholder="Av. Corrientes 1234, Piso 5, Depto A" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input placeholder="Buenos Aires" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="cursor-pointer"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROVINCES).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Código Postal</Label>
                <Input placeholder="1000" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <h3 className="font-medium mb-4">Método de Envío</h3>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                <div className={`flex items-center justify-between p-4 border rounded-lg ${shippingMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="cursor-pointer">
                      <span className="font-medium text-green-700">Retirar en Local</span>
                      <span className="text-sm text-muted-foreground block">Retiralo gratis en Av. Rivadavia 4700</span>
                    </Label>
                  </div>
                  <span className="font-medium text-success">Gratis</span>
                </div>
                <div className={`flex items-center justify-between p-4 border rounded-lg ${shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      <span className="font-medium">Envío Estándar</span>
                      <span className="text-sm text-muted-foreground block">5-7 días hábiles</span>
                    </Label>
                  </div>
                  <span className="font-medium">{subtotal >= 75000 ? "Gratis" : formatCurrency(5999)}</span>
                </div>
              </RadioGroup>
            </div>

            <Button type="button" className="mt-5 cursor-pointer" onClick={handleContinueShipping}>
              Continuar
            </Button>
          </StepCard>

          {/* ── STEP 3: Pago ── */}
          <StepCard
            number={3}
            title="Información de Pago"
            icon={<CreditCard className="h-4 w-4" />}
            isOpen={currentStep === 3}
            isDone={doneSteps.has(3)}
            isLocked={!doneSteps.has(2) && currentStep !== 3}
            onEdit={() => editStep(3)}
            summary={
              doneSteps.has(3)
                ? (
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>{PAYMENT_LABELS[paymentMethod]}</p>
                    {memberValidated && <p className="text-green-600">✓ Precio socio aplicado</p>}
                  </div>
                )
                : null
            }
          >
            {/* Beneficio socio */}
            <div className="rounded-lg border border-border p-4 space-y-3 mb-6">
              <Label className="text-sm font-medium">Ingresa tu Nombre y Apellido de socio</Label>
              <div className="space-y-3">
                <Input
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Ej: Perez Juan"
                />
                <Button type="button" onClick={handleValidateMember} disabled={validatingMember || !memberName.trim()} className="cursor-pointer">
                  {validatingMember ? "Validando..." : "Validar nombre de socio"}
                </Button>
                {memberValidated && <p className="text-sm text-green-600">✓ Nombre válido. Se aplicó el precio de socio.</p>}
                {memberError && <p className="text-sm text-red-600">{memberError}</p>}
                <a href="https://wa.me/5491123456789?text=Hola,%20quiero%20hacerme%20socio" target="_blank" rel="noopener noreferrer" className="block text-sm text-primary underline">
                  ¿No sos socio? Hacete socio
                </a>
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Método de Pago</Label>
              <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="grid grid-cols-2 gap-2">
                {[
                  { value: "credit-card", label: "Tarjeta de Crédito", icon: <CreditCard className="h-4 w-4 text-muted-foreground" /> },
                  { value: "debit-card", label: "Tarjeta de Débito", icon: <CreditCard className="h-4 w-4 text-muted-foreground" /> },
                  { value: "mercadopago", label: "MercadoPago", icon: (
                    <svg viewBox="0 0 100 100" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="50" fill="#009EE3"/>
                      <rect x="46" y="14" width="8" height="30" rx="4" fill="white" transform="rotate(0 50 50)"/>
                      <rect x="46" y="14" width="8" height="30" rx="4" fill="white" transform="rotate(60 50 50)"/>
                      <rect x="46" y="14" width="8" height="30" rx="4" fill="white" transform="rotate(120 50 50)"/>
                      <rect x="46" y="14" width="8" height="30" rx="4" fill="white" transform="rotate(180 50 50)"/>
                      <rect x="46" y="14" width="8" height="30" rx="4" fill="white" transform="rotate(240 50 50)"/>
                      <rect x="46" y="14" width="8" height="30" rx="4" fill="white" transform="rotate(300 50 50)"/>
                    </svg>
                  ) },
                  { value: "transfer", label: "Transferencia", icon: (
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  )},
                ].map((opt) => (
                  <label
                    key={opt.value}
                    htmlFor={opt.value}
                    className={
                      opt.value === "mercadopago"
                        ? `cursor-pointer p-3 border rounded-lg flex items-center gap-2 transition-all border-[#009EE3] bg-[#009EE3] text-white ring-1 ring-[#009EE3] ${paymentMethod === "mercadopago" ? "shadow-md" : "opacity-80 hover:opacity-100"}`
                        : `cursor-pointer p-3 border rounded-lg flex items-center gap-2 transition-all ${
                            paymentMethod === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`
                    }
                  >
                    <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                    {opt.icon}
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {paymentMethod === "mercadopago" && (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  Al presionar Pagar serás redirigido a MercadoPago para completar el pago de forma segura.
                </p>
                <button
                  type="button"
                  className="w-full mt-4 rounded-lg py-3 text-sm font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#009EE3" }}
                  disabled={isLoading || !doneSteps.has(1) || !doneSteps.has(2)}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Procesando..." : `Pagar ${formatCurrency(total)}`}
                </button>
              </>
            )}
            {paymentMethod === "transfer" && (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  Al presionar Pagar se mostrarán los datos de la cuenta bancaria y las instrucciones para completar la transferencia.
                </p>
                <button
                  type="button"
                  className="w-full mt-4 rounded-lg py-3 text-sm font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#009EE3" }}
                  disabled={isLoading || !doneSteps.has(1) || !doneSteps.has(2)}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Procesando..." : `Pagar ${formatCurrency(total)}`}
                </button>
              </>
            )}

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Tus datos están protegidos con encriptación SSL</span>
            </div>

          </StepCard>
          {/* ── Card Payment Brick inline ── */}
          {isCard && mpPublicKey && (currentStep === 3 || doneSteps.has(3)) && (
            <div className="rounded-xl border bg-card p-5">
              <InlineCardBrick
                key={paymentMethod}
                amount={total}
                email={email}
                paymentType={paymentMethod as "credit-card" | "debit-card"}
                publicKey={mpPublicKey}
                onPayment={handleCardPayment}
                onBrickError={(msg) => {
                  toast.error(msg)
                  setIsLoading(false)
                }}
              />
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

            {memberValidated && memberSavings > 0 && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm font-medium text-green-700">Precio socio aplicado</p>
                <p className="text-xs text-green-600">Ahorrás {formatCurrency(memberSavings)} en tus productos</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {items.map((item) => {
                const unitPrice = getUnitPrice(item.product)
                const lineTotal = unitPrice * item.quantity
                const originalLineTotal = item.product.price * item.quantity
                const hasMemberDiscount = memberValidated && !!item.product.memberPrice && item.product.memberPrice < item.product.price

                return (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                    <div className="relative w-16 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.product.images[0] || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.selectedColor} / {item.selectedSize}</p>
                      {hasMemberDiscount ? (
                        <div className="mt-1">
                          <p className="text-xs text-muted-foreground line-through">{formatCurrency(originalLineTotal)}</p>
                          <p className="text-sm font-medium text-primary">{formatCurrency(lineTotal)}</p>
                          <p className="text-[11px] text-green-600">Precio socio</p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium mt-1">{formatCurrency(lineTotal)}</p>
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
                  <span className="line-through text-muted-foreground">{formatCurrency(subtotalWithoutMemberDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{memberValidated && memberSavings > 0 ? "Subtotal con socio" : "Subtotal"}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {memberValidated && memberSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Ahorro socio</span>
                  <span>-{formatCurrency(memberSavings)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                {shippingCost === 0 ? <span className="text-success">Gratis</span> : <span>{formatCurrency(shippingCost)}</span>}
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>


            <p className="text-xs text-muted-foreground text-center mt-4">
              Al completar tu compra, aceptas nuestros{" "}
              <a href="/terms" className="underline">Términos y Condiciones</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── StepCard component ──
interface StepCardProps {
  number: number
  title: string
  icon: React.ReactNode
  isOpen: boolean
  isDone: boolean
  isLocked?: boolean
  onEdit: () => void
  summary: React.ReactNode
  children: React.ReactNode
}

function StepCard({ number, title, icon, isOpen, isDone, isLocked, onEdit, summary, children }: StepCardProps) {
  return (
    <div className={`rounded-xl border bg-card transition-all duration-200 ${isLocked ? "opacity-50" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
          isDone ? "bg-primary text-primary-foreground" : isOpen ? "bg-primary/10 text-primary border-2 border-primary" : "bg-muted text-muted-foreground"
        }`}>
          {isDone ? <Check className="h-4 w-4" /> : number}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-muted-foreground">{icon}</span>
          <h2 className="font-semibold text-base">{title}</h2>
        </div>

        {isDone && !isOpen && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 text-primary hover:text-primary cursor-pointer"
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
        )}

        {!isDone && !isOpen && !isLocked && (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Summary (done + collapsed) */}
      {isDone && !isOpen && summary && (
        <div className="px-5 pb-4 pt-0 border-t border-border/50">
          <div className="mt-3">{summary}</div>
        </div>
      )}

      {/* Form (open) */}
      {isOpen && !isLocked && (
        <div className="px-5 pb-5 border-t border-border/50 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}
