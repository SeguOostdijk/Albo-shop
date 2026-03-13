"use client"

import React from "react"

import { useState } from "react"
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

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const subtotal = getTotalPrice()
  const shippingCost = shippingMethod === "express" ? 9999 : shippingMethod === "pickup" ? 0 : subtotal >= 75000 ? 0 : 5999
  const total = subtotal + shippingCost

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Get form data
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const province = formData.get("province") as string
    const postalCode = formData.get("postalCode") as string
    
    // Payment info - only get card details if credit or debit card is selected
    let paymentInfo: { method: string; last4?: string; brand?: string; cardName?: string; dni?: string } = {
      method: paymentMethod,
    }
    
    if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
      const cardNumber = formData.get("cardNumber") as string
      const cardName = formData.get("cardName") as string
      const dni = formData.get("dni") as string
      paymentInfo = {
        method: paymentMethod,
        last4: cardNumber ? cardNumber.replace(/\s/g, "").slice(-4) : "",
        brand: "Visa",
        cardName: cardName,
        dni: dni,
      }
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          paymentInfo
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Pedido realizado con exito!")
        clearCart()
        // If user is logged in, redirect to orders
        window.location.href = "/account/orders"
      } else {
        toast.error(data.error || "Error al procesar el pago. Intenta nuevamente.")
      }
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

      {/* Back to cart */}
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
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <section className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Informacion de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
{user ? (
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="placeholder:text-muted-foreground/60 bg-muted cursor-not-allowed"
                    value={user?.email || ''}
                    readOnly
                    required
                  />
                ) : (
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="placeholder:text-muted-foreground/60"
                    defaultValue=""
                    required
                  />
                )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
{user ? (
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    className="placeholder:text-muted-foreground/60 bg-muted cursor-not-allowed"
                    value={user?.user_metadata?.phone || user?.phone || ''}
                    readOnly
                    required
                  />
                ) : (
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    className="placeholder:text-muted-foreground/60"
                    defaultValue=""
                    required
                  />
                )}
                </div>
              </div>
{user ? (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">✓ Datos precargados automáticamente</span>
<Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto cursor-pointer"
                    onClick={() => window.open('/account/profile', '_blank')}
                  >
                    Cambiar Datos
                  </Button>
                </div>
              ) : null}
            </section>

            {/* Shipping Address */}
            <section className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold">Direccion de Envio</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" placeholder="Juan" className="placeholder:text-muted-foreground/60" defaultValue={user?.user_metadata?.first_name || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Perez" className="placeholder:text-muted-foreground/60" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Direccion</Label>
                  <Input
                    id="address"
                    placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                    className="placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" placeholder="Buenos Aires" className="placeholder:text-muted-foreground/60" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Select defaultValue="caba">
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
                  <Input id="postalCode" placeholder="1000" className="placeholder:text-muted-foreground/60" required />
                </div>
              </div>

              {/* Shipping Method */}
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
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="cursor-pointer hover:text-primary transition-colors">
                        <span className="font-medium">Envio Express</span>
                        <span className="text-sm text-muted-foreground block">
                          24-48 horas (CABA y GBA)
                        </span>
                      </Label>
                    </div>
                    <span className="font-medium">{formatCurrency(9999)}</span>
                  </div>
                </RadioGroup>
              </div>
            </section>

            {/* Payment Information */}
            <section className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold">Informacion de Pago</h2>
              </div>
              
              {/* Payment Method Selection */}
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

              {/* Card Details - Only show for credit/debit cards */}
              {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numero de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="placeholder:text-muted-foreground/60"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Vencimiento</Label>
                      <Input id="expiry" placeholder="MM/AA" className="placeholder:text-muted-foreground/60" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="placeholder:text-muted-foreground/60" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                    <Input id="cardName" placeholder="JUAN PEREZ" className="placeholder:text-muted-foreground/60" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI del titular</Label>
                    <Input id="dni" placeholder="12.345.678" className="placeholder:text-muted-foreground/60" required />
                  </div>
                </div>
              )}

              {/* Mercado Pago - Show instructions */}
              {paymentMethod === "mercadopago" && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Instrucciones de pago:</strong> Seras redirigido a Mercado Pago para completar tu pago de forma segura.
                  </p>
                </div>
              )}

              {/* Bank Transfer - Show instructions */}
              {paymentMethod === "transfer" && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    <strong>Datos para transferencia:</strong>
                  </p>
                  <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <p>Banco: Banco de la Nacion Argentina</p>
                    <p>CBU: 0110464040046411693330</p>
                    <p>Nombre: Club Atletico Indendiente de San Cayet</p>
                    <p>Cuit/Cuil: 30-70708050-3</p>
                    <p className="mt-2">Una vez realizada la transferencia, envianos el comprobante a <strong>alboshop@example.com</strong></p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Tus datos estan protegidos con encriptacion SSL</span>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
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
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
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

              {/* Submit Button */}
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
