export interface ProductVariant {
  color: string
  colorHex: string
  sizes: string[]
  sku: string
  stockMock: number
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  price: number
  originalPrice?: number
  images: string[]
  variants: ProductVariant[]
  tags: string[]
  description: string
  isNew?: boolean
  isFeatured?: boolean
}

export const subcategories = [
  { name: "Remeras", slug: "camisetas" },
  { name: "Buzos", slug: "buzos" },
  { name: "Camperas", slug: "camperas" },
  { name: "Pantalones", slug: "pantalones" },
]

export const categories = [
  { name: "Primera Division", slug: "primera-division" },
  { name: "Femenino", slug: "femenino" },
  { name: "Infantiles", slug: "infantiles" },
  { name: "Accesorios", slug: "accesorios" },
]
