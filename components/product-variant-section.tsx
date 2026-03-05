"use client"

import { useMemo, useState } from "react"
import { VariantSelector } from "@/components/variant-selector"
import type { ProductVariant, Product } from "@/lib/types/products"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Minus, Plus } from "lucide-react"
import { toast } from "sonner"

export function ProductVariantSection({
  variants,
  product,
}: {
  variants: ProductVariant[]
  product: Product
}) {
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  // Opcional: cuando cambia color, reseteamos talle si no existe para ese color
  const availableSizes = useMemo(() => {
    const v = variants.find((x) => x.color === selectedColor)
    return v?.sizes ?? []
  }, [variants, selectedColor])

  const onColorChange = (color: string) => {
    setSelectedColor(color)
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize("")
    }
  }

  const onSizeChange = (size: string) => {
    setSelectedSize(size)
  }

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Por favor seleccioná un color")
      return
    }
    if (!selectedSize) {
      toast.error("Por favor seleccioná un talle")
      return
    }
    
    addItem(product, selectedColor, selectedSize, quantity)
    toast.success(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} agregadas al carrito`)
    openCart()
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  // Button is never disabled - let user click and we'll show error messages if needed
  const isDisabled = false

  return (
    <div className="space-y-6">
      <VariantSelector
        variants={variants}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onColorChange={onColorChange}
        onSizeChange={onSizeChange}
      />

      {/* Quantity Selector */}
      <div>
        <span className="text-sm font-medium block mb-3">Cantidad</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none cursor-pointer"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none cursor-pointer"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            (máx. 10 unidades)
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="w-full h-14 text-lg font-semibold bg-[#0f2f98] hover:bg-[#0a2475] cursor-pointer"
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        AGREGAR AL CARRITO
      </Button>
    </div>
  )
}
