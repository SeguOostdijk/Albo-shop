export interface ProductStock {
  size: string
  stock: number
}

export interface ProductVariant {
  color: string
  colorHex: string
  sku: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  price: number
  memberPrice?: number
  originalPrice?: number
  images: string[]
  variants: ProductVariant[]
  stockBySize: ProductStock[]
  tags: string[]
  description: string
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  salePercentage?: number
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