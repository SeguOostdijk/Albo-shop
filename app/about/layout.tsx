import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la historia y los valores del Club Atlético Independiente de San Cayetano. Tienda oficial de indumentaria y accesorios del club.",
  openGraph: {
    title: "Nosotros | Albo Shop",
    description:
      "Conocé la historia del Club Atlético Independiente de San Cayetano y su tienda oficial.",
    url: "https://alboshop.com.ar/about",
    images: [{ url: "/escudo.jpeg", alt: "Escudo Club Atlético Independiente San Cayetano" }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
