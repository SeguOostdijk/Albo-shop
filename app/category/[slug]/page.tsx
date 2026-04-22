export const revalidate = 60

import type { Metadata } from "next"
import { CategoryPageClient } from "@/components/category-page-client"
import { getAllProductsFromDb, getProductsByCategoryFromDb } from "@/lib/products-db"
import { categories } from "@/lib/type/products"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  "primera-division": {
    title: "Indumentaria Primera División",
    description:
      "Camisetas, buzos, camperas y shorts del equipo de Primera División del Club Atlético Independiente de San Cayetano. Envíos a todo el país.",
  },
  femenino: {
    title: "Indumentaria Femenino",
    description:
      "Indumentaria oficial del equipo femenino del Club Atlético Independiente de San Cayetano. Camisetas, shorts y más.",
  },
  infantiles: {
    title: "Indumentaria Infantiles",
    description:
      "Ropa deportiva oficial para los más chicos del Club Atlético Independiente de San Cayetano. Camisetas y accesorios infantiles.",
  },
  extras: {
    title: "Accesorios y Extras",
    description:
      "Gorras, tazas, llaveros, mousepads y más accesorios oficiales del Club Atlético Independiente de San Cayetano.",
  },
  novedades: {
    title: "Novedades",
    description:
      "Los productos más nuevos de la tienda oficial del Club Atlético Independiente de San Cayetano.",
  },
  oportunidades: {
    title: "Ofertas y Oportunidades",
    description:
      "Productos en oferta de la tienda oficial del Club Atlético Independiente de San Cayetano. ¡Aprovechá los mejores precios!",
  },
  all: {
    title: "Todos los Productos",
    description:
      "Explorá toda la indumentaria y accesorios oficiales del Club Atlético Independiente de San Cayetano.",
  },
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug] ?? {
    title: "Productos",
    description: "Indumentaria y accesorios del Club Atlético Independiente de San Cayetano.",
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Albo Shop`,
      description: meta.description,
      url: `https://alboshop.com.ar/category/${slug}`,
      images: [{ url: "/Club.jpg", alt: "Albo Shop — Club Atlético Independiente San Cayetano" }],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const products =
    slug === "all"
      ? await getAllProductsFromDb()
      : await getProductsByCategoryFromDb(slug)

  return (
    <CategoryPageClient
      slug={slug}
      products={products}
      categories={categories}
    />
  )
}