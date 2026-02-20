"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useCartStore } from "@/lib/cart-store"
import { formatCurrency } from "@/lib/currency"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 75000 ? 0 : 5999
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito esta vacio</h1>
          <p className="text-muted-foreground mb-8">
            Explora nuestra tienda y encontra los productos que te gustan
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
      <Breadcrumbs items={[{ label: "Carrito" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="flex gap-4 p-4 bg-card rounded-lg border border-border"
            >
              {/* Product Image */}
              <Link
                href={`/product/${item.product.slug}`}
                className="relative w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden bg-muted flex-shrink-0"
              >
                <Image
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-medium hover:text-secondary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.selectedColor} / {item.selectedSize}
                  </p>
                  <p className="font-semibold mt-2">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedColor,
                          item.selectedSize,
                          item.quantity - 1
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Disminuir cantidad</span>
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.selectedColor,
                          item.selectedSize,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Aumentar cantidad</span>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      removeItem(item.product.id, item.selectedColor, item.selectedSize)
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <Link
            href="/category/hombre"
            className="inline-flex items-center text-sm text-secondary hover:underline mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>

            {/* Coupon Code */}
            <div className="flex gap-2 mb-6">
              <Input placeholder="Codigo de descuento" className="flex-1" />
              <Button variant="outline">Aplicar</Button>
            </div>

            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envio</span>
                {shipping === 0 ? (
                  <span className="text-success">Gratis</span>
                ) : (
                  <span>{formatCurrency(shipping)}</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Envio gratis en compras mayores a $75.000
                </p>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">Iniciar Checkout</Link>
            </Button>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Medios de pago aceptados
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">
                  MC
                </div>
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">
                  AMEX
                </div>
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">
                  MP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
