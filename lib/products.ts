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
  // Nuevos productos para Hombre
  {
    id: "h1",
    slug: "camiseta-blanca",
      name: "Camiseta Blanca",
      category: "Hombre",
      categorySlug: "hombre",
      price: 59999,
      images: ["/Camiseta Blanca - Primera Division.png"],
      variants: [
        { color: "Blanco", colorHex: "#ffffff", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CB-H", stockMock: 50 },
      ],
      tags: ["camisetas"],
      description: "Camiseta blanca",
    },
    {
      id: "h2",
      slug: "camiseta-negra",
      name: "Camiseta Negra",
      category: "Hombre",
      categorySlug: "hombre",
      price: 59999,
      images: ["/Camiseta Negra - Primera Division.png"],
      variants: [
        { color: "Negro", colorHex: "#000000", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CN-H", stockMock: 50 },
      ],
      tags: ["camisetas"],
      description: "Camiseta básica negra para uso diario.",
    },
    {
      id: "h3",
      slug: "campera-abrigo-negra",
      name: "Campera Abrigo Negra",
      category: "Hombre",
      categorySlug: "hombre",
      price: 119999,
      images: ["/Campera Abrigo Negra - Primera Division.png"],
      variants: [
        { color: "Negro", colorHex: "#000000", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CAN-H", stockMock: 30 },
      ],
      tags: ["camperas"],
      description: "Campera de abrigo negra, ideal para invierno.",
    },
    {
      id: "h4",
      slug: "campera-impermeable-azul",
      name: "Campera Impermeable Azul",
      category: "Hombre",
      categorySlug: "hombre",
      price: 109999,
      images: ["/Campera Impermeable Azul - Primera Division.png"],
      variants: [
        { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CIA-H", stockMock: 30 },
      ],
      tags: ["camperas"],
      description: "Campera impermeable azul, perfecta para días de lluvia.",
    },
    {
      id: "h5",
      slug: "campera-liviana-azul",
      name: "Campera Liviana Azul",
      category: "Hombre",
      categorySlug: "hombre",
      price: 89999,
      images: ["/Campera Liviana Azul - Primera Division.png"],
      variants: [
        { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CLA-H", stockMock: 30 },
      ],
      tags: ["camperas"],
      description: "Campera liviana azul, ideal para entretiempo.",
    },
    {
      id: "h6",
      slug: "campera-rompevientos",
      name: "Campera Rompevientos",
      category: "Hombre",
      categorySlug: "hombre",
      price: 99999,
      images: ["/Campera Rompevientos - Primera Division.png"],
      variants: [
        { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CRV-H", stockMock: 30 },
      ],
      tags: ["camperas"],
      description: "Campera rompevientos azul, resistente al viento.",
    },
    {
      id: "h7",
      slug: "chomba-azul",
      name: "Chomba Azul",
      category: "Hombre",
      categorySlug: "hombre",
      price: 69999,
      images: ["/Chomba Azul - Primera Division.png"],
      variants: [
        { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CHA-H", stockMock: 40 },
      ],
      tags: ["chombas"],
      description: "Chomba azul clásica, cómoda y elegante.",
    },
    {
      id: "h8",
      slug: "camiseta-azul-entrenamiento",
      name: "Camiseta Azul Entrenamiento",
      category: "Hombre",
      categorySlug: "hombre",
      price: 64999,
      images: ["/Camiseta Azul Entrenamiento - Primera Division.png"],
      variants: [
        { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CAE-H", stockMock: 40 },
      ],
      tags: ["camisetas", "entrenamiento"],
      description: "Camiseta azul para entrenamiento, tejido transpirable.",
    },
    {
      id: "h9",
      slug: "buzo-gris",
      name: "Buzo Gris",
      category: "Hombre",
      categorySlug: "hombre",
      price: 79999,
      images: ["/Buzo Gris - Primera Division.png"],
      variants: [
        { color: "Gris", colorHex: "#6b7280", sizes: ["S", "M", "L", "XL", "XXL"], sku: "BG-H", stockMock: 35 },
      ],
      tags: ["buzos"],
      description: "Buzo gris de algodón, suave y confortable.",
    },
    {
      id: "h10",
      slug: "buzo-azul",
      name: "Buzo Azul",
      category: "Hombre",
      categorySlug: "hombre",
      price: 79999,
      images: ["/Buzo Capucha Azul - Primera Division.png"],
      variants: [
        { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "BA-H", stockMock: 35 },
      ],
      tags: ["buzos"],
      description: "Buzo azul de algodón, suave y confortable.",
    },
  {
    id: "7",
    slug: "gorra-oficial",
    name: "Gorra Oficial",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 24999,
    images: [
      "/Gorra.png",
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
    slug: "piluso-gris",
    name: "Piluso Gris",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 19999,
    images: [
      "/PilusoGris.png",
    ],
    variants: [
      { color: "Azul/Blanco", colorHex: "#1a365d", sizes: ["Único"], sku: "BH-AB", stockMock: 150 },
    ],
    tags: ["accesorios"],
    description: "Bufanda tejida con los colores del club. Ideal para los días de partido.",
  },
  {
    id: "9",
    slug: "Buzo de entrenamiento",
    name: "Buzo de Entrenamiento",
    category: "Infantil",
    categorySlug: "infantil",
    price: 99999,
    originalPrice: 124999,
    images: [
      "/buzoMasculino.png",
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
    slug: "canilleras",
    name: "Canilleras",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 34999,
    images: [
      "/Canilleras.png",
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
    slug: "llavero",
    name: "Llavero",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 9999,
    images: [
      "/Llavero.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
    {
    id: "13",
    slug: "piluso-azul",
    name: "Piluso Azul",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 24999,
    images: [
      "/PilusoAzul.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
    {
    id: "14",
    slug: "gorro",
    name: "Gorro",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 24999,
    images: [
      "/Gorro.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
    {
    id: "15",
    slug: "taza",
    name: "Taza",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "/Taza.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
      {
    id: "16",
    slug: "cartuchera",
    name: "Cartuchera",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "/Cartuchera.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
      {
    id: "17",
    slug: "mousepad tricampeon redondo",
    name: "Mousepad tricampeon redondo",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "/Mousepad.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
        {
    id: "18",
    slug: "medias azules",
    name: "Medias Azules",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 9999,
    images: [
      "/MediasAzules.png",
    ],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["Único"], sku: "MD-AZ", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
          {
    id: "19",
    slug: "medias negras",
    name: "Medias Negras",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 9999,
    images: [
      "/MediasNegras.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
            {
    id: "20",
    slug: "Llavero estuche",
    name: "Llavero estuche",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 9999,
    images: [
      "/LlaveroEstuche.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
              {
    id: "21",
    slug: "mousepad tricampeon ovalado",
    name: "Mousepad Tricampeon Ovalado",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "/MousepadTricampeonOvalado.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
                    {
    id: "22",
    slug: "Mousepad 98 años",
    name: "Mousepad 98 Años",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "/Mousepad98Anios.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
                {
    id: "23",
    slug: "libro el gigante dormido",
    name: "Libro El Gigante Dormido",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 24999,
    images: [
      "/Libro.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
                    {
    id: "24",
    slug: "yerbera",
    name: "Yerbera",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 14999,
    images: [
      "/Yerbera.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
    ],
    tags: ["accesorios"],
    description: "Mochila oficial con compartimento para laptop. Múltiples bolsillos.",
  },
                      {
    id: "25",
    slug: "bermuda negra",
    name: "Bermuda Negra",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 34999,
    images: [
      "/BermudaNegra.png",
    ],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["Único"], sku: "MD-NK", stockMock: 40 },
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
