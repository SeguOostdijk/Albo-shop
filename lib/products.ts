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

export const products: Product[] = [
  {
    id: "1",
    slug: "camiseta-titular-2025",
    name: "Camiseta Titular 2025",
    category: "Hombre",
    categorySlug: "hombre",
    price: 89999,
    originalPrice: 109999,
    images: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CT25-AZ", stockMock: 50 },
      { color: "Blanco", colorHex: "#ffffff", sizes: ["S", "M", "L", "XL"], sku: "CT25-BL", stockMock: 30 },
    ],
    tags: ["nueva-temporada", "destacados", "camisetas"],
    description: "La camiseta oficial de la temporada 2025. Confeccionada con tecnología Dri-FIT que mantiene la piel fresca y seca. Diseño clásico con los colores del club.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "camiseta-alternativa-2025",
    name: "Camiseta Alternativa 2025",
    category: "Hombre",
    categorySlug: "hombre",
    price: 84999,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Celeste", colorHex: "#87CEEB", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CA25-CE", stockMock: 40 },
    ],
    tags: ["nueva-temporada", "camisetas"],
    description: "Camiseta alternativa con diseño exclusivo. Tejido ligero y transpirable ideal para el verano.",
    isNew: true,
  },
  {
    id: "3",
    slug: "buzo-entrenamiento",
    name: "Buzo de Entrenamiento",
    category: "Hombre",
    categorySlug: "hombre",
    price: 74999,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul Oscuro", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL"], sku: "BE-AO", stockMock: 25 },
      { color: "Gris", colorHex: "#6b7280", sizes: ["S", "M", "L", "XL"], sku: "BE-GR", stockMock: 20 },
    ],
    tags: ["entrenamiento", "destacados"],
    description: "Buzo oficial de entrenamiento. Capucha ajustable y bolsillos laterales.",
    isFeatured: true,
  },
  {
    id: "4",
    slug: "short-titular",
    name: "Short Titular",
    category: "Hombre",
    categorySlug: "hombre",
    price: 44999,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL"], sku: "ST-AZ", stockMock: 60 },
      { color: "Blanco", colorHex: "#ffffff", sizes: ["S", "M", "L", "XL"], sku: "ST-BL", stockMock: 45 },
    ],
    tags: ["nueva-temporada", "shorts"],
    description: "Short oficial que complementa la camiseta titular. Cintura elástica con cordón.",
    isNew: true,
  },
  {
    id: "5",
    slug: "camiseta-mujer-titular",
    name: "Camiseta Mujer Titular 2025",
    category: "Mujer",
    categorySlug: "mujer",
    price: 84999,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["XS", "S", "M", "L", "XL"], sku: "CTM25-AZ", stockMock: 35 },
    ],
    tags: ["nueva-temporada", "destacados", "camisetas", "mujer"],
    description: "Camiseta oficial femenina con corte entallado. Tecnología de secado rápido.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "6",
    slug: "camiseta-nino-titular",
    name: "Camiseta Niño Titular 2025",
    category: "Niños",
    categorySlug: "ninos",
    price: 64999,
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["4", "6", "8", "10", "12", "14"], sku: "CTN25-AZ", stockMock: 50 },
    ],
    tags: ["nueva-temporada", "camisetas", "ninos"],
    description: "Camiseta oficial para los más pequeños hinchas. Material resistente y cómodo.",
    isNew: true,
  },
  {
    id: "7",
    slug: "gorra-oficial",
    name: "Gorra Oficial",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 24999,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "GO-AZ", stockMock: 100 },
      { color: "Blanco", colorHex: "#ffffff", sizes: ["Único"], sku: "GO-BL", stockMock: 80 },
    ],
    tags: ["accesorios", "destacados"],
    description: "Gorra oficial con escudo bordado. Ajuste trasero de velcro.",
    isFeatured: true,
  },
  {
    id: "8",
    slug: "bufanda-hincha",
    name: "Bufanda del Hincha",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 19999,
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul/Blanco", colorHex: "#1a365d", sizes: ["Único"], sku: "BH-AB", stockMock: 150 },
    ],
    tags: ["accesorios"],
    description: "Bufanda tejida con los colores del club. Ideal para los días de partido.",
  },
  {
    id: "9",
    slug: "campera-rompevientos",
    name: "Campera Rompevientos",
    category: "Hombre",
    categorySlug: "hombre",
    price: 99999,
    originalPrice: 124999,
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd628b9?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul Oscuro", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CR-AO", stockMock: 20 },
    ],
    tags: ["entrenamiento", "destacados"],
    description: "Campera rompevientos impermeable. Cierre frontal y puños ajustables.",
    isFeatured: true,
  },
  {
    id: "10",
    slug: "medias-oficiales",
    name: "Medias Oficiales",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["35-38", "39-42", "43-46"], sku: "MO-AZ", stockMock: 200 },
      { color: "Blanco", colorHex: "#ffffff", sizes: ["35-38", "39-42", "43-46"], sku: "MO-BL", stockMock: 180 },
    ],
    tags: ["accesorios", "nueva-temporada"],
    description: "Medias oficiales con refuerzo en talón y puntera. Diseño ergonómico.",
    isNew: true,
  },
  {
    id: "11",
    slug: "remera-retro-1986",
    name: "Remera Retro 1986",
    category: "Colecciones",
    categorySlug: "colecciones",
    price: 69999,
    images: [
      "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul Vintage", colorHex: "#2d3748", sizes: ["S", "M", "L", "XL"], sku: "RR86-AV", stockMock: 15 },
    ],
    tags: ["colecciones", "retro", "destacados"],
    description: "Edición especial conmemorativa. Réplica del diseño histórico de 1986.",
    isFeatured: true,
  },
  {
    id: "12",
    slug: "mochila-deportiva",
    name: "Mochila Deportiva",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 54999,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
]

export const subcategories = [
  { name: "Remeras", slug: "remeras" },
  { name: "Buzos", slug: "buzos" },
  { name: "Camperas", slug: "camperas" },
  { name: "Pantalones", slug: "pantalones" },
]

export const categories = [
  { name: "Hombre", slug: "hombre" },
  { name: "Mujer", slug: "mujer" },
  { name: "Niños", slug: "ninos" },
  { name: "Accesorios", slug: "accesorios" },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured)
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.includes(lowerQuery))
  )
}
