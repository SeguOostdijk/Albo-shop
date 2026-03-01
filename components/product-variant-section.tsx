"use client"

import { useMemo, useState } from "react"
import { VariantSelector } from "@/components/variant-selector"
import type { ProductVariant } from "@/lib/types/products"

export function ProductVariantSection({
  variants,
}: {
  variants: ProductVariant[]
}) {
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")

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

  return (
    <VariantSelector
      variants={variants}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
      onColorChange={onColorChange}
      onSizeChange={onSizeChange}
    />
  )
}