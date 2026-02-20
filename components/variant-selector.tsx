"use client"

import { cn } from "@/lib/utils"
import type { ProductVariant } from "@/lib/products"

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedColor: string
  selectedSize: string
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
}

export function VariantSelector({
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  const selectedVariant = variants.find((v) => v.color === selectedColor)
  const availableSizes = selectedVariant?.sizes || []

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Color</span>
          <span className="text-sm text-muted-foreground">{selectedColor}</span>
        </div>
        <div className="flex gap-2">
          {variants.map((variant) => (
            <button
              key={variant.sku}
              onClick={() => onColorChange(variant.color)}
              className={cn(
                "w-10 h-10 rounded-full border-2 transition-all relative",
                selectedColor === variant.color
                  ? "border-secondary ring-2 ring-secondary ring-offset-2"
                  : "border-border hover:border-secondary"
              )}
              style={{ backgroundColor: variant.colorHex }}
              title={variant.color}
            >
              <span className="sr-only">{variant.color}</span>
              {variant.colorHex === "#ffffff" && (
                <span className="absolute inset-0 rounded-full border border-border" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Talle</span>
          <button className="text-sm text-secondary hover:underline">
            Guia de talles
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={cn(
                "min-w-[48px] h-12 px-4 rounded-md border font-medium text-sm transition-all",
                selectedSize === size
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border hover:border-secondary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Info */}
      {selectedVariant && (
        <p className="text-sm">
          {selectedVariant.stockMock > 10 ? (
            <span className="text-success">En stock</span>
          ) : selectedVariant.stockMock > 0 ? (
            <span className="text-amber-600">
              Solo quedan {selectedVariant.stockMock} unidades
            </span>
          ) : (
            <span className="text-destructive">Sin stock</span>
          )}
        </p>
      )}
    </div>
  )
}
