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
  // Nuevos productos para Femenino
  {
    id: "m1",
    slug: "camiseta-blanca-mujer",
    name: "Camiseta Blanca - Femenino",
    category: "Femenino",
    categorySlug: "femenino",
    price: 59999,
    images: ["/Camiseta Blanca - Femenino.png"],
    variants: [
      { color: "Blanco", colorHex: "#ffffff", sizes: ["S", "M", "L", "XL"], sku: "CB-M", stockMock: 30 },
    ],
    tags: ["camisetas", "nueva-temporada"],
    description: "Camiseta blanca para mujer.",
    isFeatured: true,
  },
  {
    id: "m2",
    slug: "camiseta-azul-mujer",
    name: "Camiseta Azul - Femenino",
    category: "Femenino",
    categorySlug: "femenino",
    price: 59999,
    images: ["/Camiseta Azul - Femenino.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL"], sku: "CAZ-M", stockMock: 30 },
    ],
    tags: ["camisetas"],
    description: "Camiseta azul para mujer.",
  },
  {
    id: "m3",
    slug: "camiseta-rosa-mujer",
    name: "Camiseta Rosa - Femenino",
    category: "Femenino",
    categorySlug: "femenino",
    price: 59999,
    images: ["/Camiseta Rosa - Femenino.png"],
    variants: [
      { color: "Rosa", colorHex: "#ff69b4", sizes: ["S", "M", "L", "XL"], sku: "CR-M", stockMock: 30 },
    ],
    tags: ["camisetas"],
    description: "Camiseta rosa para mujer.",
  },
  {
    id: "m4",
    slug: "calza-larga-mujer",
    name: "Calza Larga - Femenino",
    category: "Femenino",
    categorySlug: "femenino",
    price: 49999,
    images: ["/Calza Larga - Femenino.png"],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["S", "M", "L", "XL"], sku: "CL-M", stockMock: 25 },
    ],
    tags: ["calzas"],
    description: "Calza larga deportiva para mujer.",
  },
  {
    id: "m5",
    slug: "short-azul-mujer",
    name: "Short Azul - Femenino",
    category: "Femenino",
    categorySlug: "femenino",
    price: 39999,
    images: ["/Short Azul - Femenino.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL"], sku: "SAZ-M", stockMock: 25 },
    ],
    tags: ["shorts"],
    description: "Short azul para mujer.",
  },
  
  // Primera Division

  {
    id: "h1",
    slug: "camiseta-blanca",
    name: "Camiseta Blanca - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 59999,
    images: ["/Camiseta Blanca - Primera Division.png"],
    variants: [
      { color: "Blanco", colorHex: "#ffffff", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CB-H", stockMock: 50 },
    ],
    tags: ["camisetas", "nueva-temporada"],
    description: "Camiseta blanca 2026",
    isFeatured: true,
  },
  {
    id: "h2",
    slug: "camiseta-negra",
    name: "Camiseta Negra - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 59999,
    images: ["/Camiseta Negra - Primera Division.png"],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CN-H", stockMock: 50 },
    ],
    tags: ["camisetas"],
    description: "Camiseta Negra 2026.",
  },
  {
    id: "h3",
    slug: "campera-abrigo-negra",
    name: "Campera de Abrigo - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 119999,
    images: ["/Campera Abrigo Negra - Primera Division.png"],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CAN-H", stockMock: 30 },
    ],
    tags: ["camperas"],
    description: "Campera de abrigo negra.",
  },
  {
    id: "h4",
    slug: "campera-impermeable-azul",
    name: "Campera Impermeable - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 109999,
    images: ["/Campera Impermeable Azul - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CIA-H", stockMock: 30 },
    ],
    tags: ["camperas"],
    description: "Campera impermeable azul.",
  },
  {
    id: "h5",
    slug: "campera-liviana-azul",
    name: "Campera Liviana - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 89999,
    images: ["/Campera Liviana Azul - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CLA-H", stockMock: 30 },
    ],
    tags: ["camperas"],
    description: "Campera liviana azul.",
    isFeatured: true,
  },
  {
    id: "h6",
    slug: "campera-rompevientos",
    name: "Campera Rompevientos - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 99999,
    images: ["/Campera Rompevientos - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CRV-H", stockMock: 30 },
    ],
    tags: ["camperas"],
    description: "Campera rompevientos azul.",
  },
  {
    id: "h7",
    slug: "chomba-azul",
    name: "Chomba Azul - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 69999,
    images: ["/Chomba Azul - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CHA-H", stockMock: 40 },
    ],
    tags: ["chombas"],
    description: "Chomba azul clásica.",
  },
  {
    id: "h8",
    slug: "camiseta-azul-entrenamiento",
    name: "Camiseta de Entrenamiento - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 64999,
    images: ["/Camiseta Azul Entrenamiento - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "CAE-H", stockMock: 40 },
    ],
    tags: ["camisetas", "entrenamiento"],
    description: "Camiseta azul de entrenamiento.",
  },
  {
    id: "h9",
    slug: "buzo-gris",
    name: "Buzo Gris - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 79999,
    images: ["/Buzo Gris - Primera Division.png"],
    variants: [
      { color: "Gris", colorHex: "#6b7280", sizes: ["S", "M", "L", "XL", "XXL"], sku: "BG-H", stockMock: 35 },
    ],
    tags: ["buzos"],
    description: "Buzo gris de algodón.",
    isFeatured: true,
  },
  {
    id: "h10",
    slug: "buzo-azul",
    name: "Buzo Azul - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 79999,
    images: ["/Buzo Capucha Azul - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "BA-H", stockMock: 35 },
    ],
    tags: ["buzos"],
    description: "Buzo azul de algodón.",
  },
  {
    id: "h11",
    slug: "short-negro-y-azul",
    name: "Short Negro y Azul - Primera Division",
    category: "Primera Division",
    categorySlug: "primera-division",
    price: 59999,
    images: ["/Short Negro y Azul - Primera Division.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["S", "M", "L", "XL", "XXL"], sku: "BA-H", stockMock: 35 },
    ],
    tags: ["pantalones"],
    description: "Short negro y azul de algodón.",
    isFeatured: true,
  },

  // Nuevos productos para Infantiles

  {
    id: "i1",
    slug: "camiseta-azul-y-celeste-infantil",
    name: "Camiseta Azul y Celeste - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 45999,
    images: ["/Camiseta Azul y Celeste.png"],
    variants: [
      { color: "Azul y Celeste", colorHex: "#1a365d", sizes: ["2", "4", "6", "8", "10", "12"], sku: "CAZC-I", stockMock: 25 },
    ],
    tags: ["camisetas", "infantil"],
    description: "Camiseta azul y celeste para niños.",
    isFeatured: true,
  },
  {
    id: "i2",
    slug: "camiseta-azul-celeste-y-blanco-infantil",
    name: "Camiseta Azul Celeste y Blanco - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 45999,
    images: ["/Camiseta Azul Celeste y Blanca.png"],
    variants: [
      { color: "Azul Celeste y Blanco", colorHex: "#1a365d", sizes: ["2", "4", "6", "8", "10", "12"], sku: "CACB-I", stockMock: 25 },
    ],
    tags: ["camisetas", "infantil"],
    description: "Camiseta azul celeste y blanco para niños.",
  },
  {
    id: "i3",
    slug: "pantalon-azul-infantil",
    name: "Pantalon Azul - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 32999,
    images: ["/Pantalon Azul.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["2", "4", "6", "8", "10", "12"], sku: "PA-I", stockMock: 20 },
    ],
    tags: ["pantalones", "infantil"],
    description: "Pantalon azul para niños.",
    isFeatured: true,
  },
  {
    id: "i4",
    slug: "pantalon-negro-y-azul-infantil",
    name: "Pantalon Negro y Azul - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 32999,
    images: ["/Pantalon Negro y Azul.png"],
    variants: [
      { color: "Negro y Azul", colorHex: "#000000", sizes: ["2", "4", "6", "8", "10", "12"], sku: "PNA-I", stockMock: 20 },
    ],
    tags: ["pantalones", "infantil"],
    description: "Pantalon negro y azul para niños.",
  },
  {
    id: "i5",
    slug: "short-negro-infantil",
    name: "Short Negro - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 27999,
    images: ["/Short Negro.png"],
    variants: [
      { color: "Negro", colorHex: "#000000", sizes: ["2", "4", "6", "8", "10", "12"], sku: "SN-I", stockMock: 25 },
    ],
    tags: ["shorts", "infantil"],
    description: "Short negro para niños.",
  },
  {
    id: "i6",
    slug: "short-azul-infantil",
    name: "Short Azul - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 27999,
    images: ["/Short Azul.png"],
    variants: [
      { color: "Azul", colorHex: "#1a365d", sizes: ["2", "4", "6", "8", "10", "12"], sku: "SA-I", stockMock: 25 },
    ],
    tags: ["shorts", "infantil"],
    description: "Short azul para niños.",
  },
  {
    id: "i7",
    slug: "short-blanco-y-azul-infantil",
    name: "Short Blanco y Azul - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 27999,
    images: ["/Short Blanco y Azul.png"],
    variants: [
      { color: "Blanco y Azul", colorHex: "#ffffff", sizes: ["2", "4", "6", "8", "10", "12"], sku: "SBA-I", stockMock: 25 },
    ],
    tags: ["shorts", "infantil"],
    description: "Short blanco y azul para niños.",
  },
  {
    id: "i8",
    slug: "buzo-cierre-negro-y-azul-infantil",
    name: "Buzo Cierre Negro y Azul - Infantil",
    category: "Infantiles",
    categorySlug: "infantiles",
    price: 54999,
    images: ["/Buzo Cierre Negro y Azul.png"],
    variants: [
      { color: "Negro y Azul", colorHex: "#000000", sizes: ["2", "4", "6", "8", "10", "12"], sku: "BCNA-I", stockMock: 20 },
    ],
    tags: ["buzos", "infantil"],
    description: "Buzo con cierre negro y azul para niños.",
  },

      //Accesorios

  {
    id: "a1",
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
  },
  {
    id: "a2",
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
    id: "a3",
    slug: "canilleras",
    name: "Canilleras",
    category: "Accesorios",
    categorySlug: "accesorios",
    price: 34999,
    images: [
      "/Canilleras.png",
    ],
    variants: [
      { color: "Blanco", colorHex: "#ffffff", sizes: [], sku: "MO-BL", stockMock: 180 },
    ],
    tags: ["accesorios"],
    description: "Medias oficiales con refuerzo en talón y puntera. Diseño ergonómico.",
  },
  {
    id: "a4",
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
    id: "a5",
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
    id: "a6",
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
    id: "a7",
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
    id: "a8",
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
    id: "a9",
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
    id: "a10",
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
    id: "a11",
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
    id: "a12",
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
    id: "a13",
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
    id: "a14",
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
    id: "a15",
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
    id: "a16",
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
    id: "a17",
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
  { name: "Primera Division", slug: "primera-division" },
  { name: "Femenino", slug: "femenino" },
  { name: "Infantiles", slug: "infantiles" },
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
