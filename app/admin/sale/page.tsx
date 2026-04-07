"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

type StockRow = { size: string; stock: number }
type Product = { id: string; name: string; category_slug: string; images: string[] | null }

export default function AdminSalePage() {
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [stock, setStock] = useState<StockRow[]>([])
  const [loadingStock, setLoadingStock] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [lastSale, setLastSale] = useState<{ productName: string; size: string; qty: number; newStock: number } | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, category_slug, images")
        .order("name")
      setProducts(data ?? [])
      setLoadingProducts(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!selectedProductId) { setStock([]); setSelectedSize(""); return }
    const fetch = async () => {
      setLoadingStock(true)
      const { data } = await supabase
        .from("product_stock")
        .select("size, stock")
        .eq("product_id", selectedProductId)
        .order("size")
      setStock((data ?? []) as StockRow[])
      setSelectedSize("")
      setQuantity(1)
      setLoadingStock(false)
    }
    fetch()
  }, [selectedProductId])

  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const selectedStockRow = stock.find((s) => s.size === selectedSize)
  const maxQuantity = selectedStockRow?.stock ?? 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId || !selectedSize || quantity <= 0) return
    if (quantity > maxQuantity) {
      toast.error(`Stock insuficiente. Disponible: ${maxQuantity}`)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProductId, size: selectedSize, quantity }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Error al registrar la venta")
        return
      }
      toast.success("Venta registrada y stock actualizado")
      setLastSale({
        productName: selectedProduct?.name ?? "",
        size: selectedSize,
        qty: quantity,
        newStock: json.newStock,
      })
      // Refresh stock display
      setStock((prev) =>
        prev.map((s) => (s.size === selectedSize ? { ...s, stock: json.newStock } : s))
      )
      setQuantity(1)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="flex justify-start max-w-3xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 text-sm font-semibold text-slate-600 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto border border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-black">Ingresar venta</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Registrá una venta manual y descontá el stock
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product selector */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Producto</label>
              {loadingProducts ? (
                <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
              ) : (
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                >
                  <option value="">— Seleccioná un producto —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Size selector + stock display */}
            {selectedProductId && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Talle / Stock disponible</label>
                {loadingStock ? (
                  <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                ) : stock.length === 0 ? (
                  <p className="text-sm text-slate-400">Sin stock registrado para este producto.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {stock.map((s) => (
                      <button
                        key={s.size ?? "unico"}
                        type="button"
                        onClick={() => setSelectedSize(s.size ?? "unico")}
                        disabled={s.stock <= 0}
                        className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
                          selectedSize === (s.size ?? "unico")
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : s.stock <= 0
                            ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                            : "bg-white text-slate-700 border-slate-200 hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {s.size ?? "Único"}{" "}
                        <span className={`text-xs ${selectedSize === (s.size ?? "unico") ? "text-white/80" : "text-slate-400"}`}>
                          ({s.stock})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            {selectedSize && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Cantidad{" "}
                  <span className="text-slate-400 font-normal">(máx. {maxQuantity})</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedProduct && selectedSize && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1">
                <p className="text-sm font-bold text-primary">Resumen de venta</p>
                <p className="text-sm text-primary/80">
                  <span className="font-semibold">{selectedProduct.name}</span> — Talle: {selectedSize}
                </p>
                <p className="text-sm text-primary/80">
                  Cantidad: <span className="font-semibold">{quantity}</span> · Stock después: <span className="font-semibold">{maxQuantity - quantity}</span>
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!selectedProductId || !selectedSize || submitting}
              className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg cursor-pointer"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Registrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Registrar venta
                </div>
              )}
            </Button>
          </form>

          {/* Last sale confirmation */}
          {lastSale && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-primary">Última venta registrada</p>
                <p className="text-sm text-primary/80">
                  {lastSale.productName} — {lastSale.size} × {lastSale.qty}
                </p>
                <p className="text-xs text-primary/60 mt-0.5">Stock restante: {lastSale.newStock}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
