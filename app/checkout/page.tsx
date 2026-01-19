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
import { formatCurrency } from "@/lib/currency"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")

  const subtotal = getTotalPrice()
  const shippingCost = shippingMethod === "express" ? 9999 : subtotal >= 75000 ? 0 : 5999
  const total = subtotal + shippingCost

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call to /api/checkout
    try {
      // This is where you would integrate with your payment API
      // await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({...}) })
      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      toast.success("Pedido realizado con exito!")
      clearCart()
      // Redirect to confirmation page
      window.location.href = "/"
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    required
                  />
                </div>
              </div>
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
                  <Input id="firstName" placeholder="Juan" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Perez" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Direccion</Label>
                  <Input
                    id="address"
                    placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" placeholder="Buenos Aires" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Select defaultValue="caba">
                    <SelectTrigger id="province">
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
                  <Input id="postalCode" placeholder="1000" required />
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
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="cursor-pointer">
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
                      <Label htmlFor="express" className="cursor-pointer">
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Numero de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input id="cardName" placeholder="JUAN PEREZ" required />
                </div>
              </div>

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
                className="w-full mt-6"
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
