"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { formatCurrency } from "@/lib/currency"

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Tu Carrito ({items.length})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">Tu carrito esta vacio</p>
            <Button onClick={closeCart} asChild>
              <Link href="/category/hombre">Explorar productos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex gap-4 pb-4 border-b border-border"
                >
                  <div className="relative w-20 h-24 rounded overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.selectedColor} / {item.selectedSize}
                    </p>
                    <p className="font-semibold mt-1">{formatCurrency(item.product.price)}</p>

                    <div className="flex items-center gap-2 mt-2">
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
                      <span className="w-8 text-center">{item.quantity}</span>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-destructive hover:text-destructive"
                        onClick={() =>
                          removeItem(item.product.id, item.selectedColor, item.selectedSize)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envio</span>
                <span className="text-success">Gratis</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(getTotalPrice())}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild onClick={closeCart}>
                  <Link href="/checkout">Iniciar Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild onClick={closeCart}>
                  <Link href="/cart">Ver Carrito</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
