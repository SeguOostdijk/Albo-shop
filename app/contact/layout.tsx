import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactanos por WhatsApp, email o visitanos en Rivadavia 150, San Cayetano, Buenos Aires. Club Atlético Independiente — atención de lunes a sábado.",
  openGraph: {
    title: "Contacto | Albo Shop",
    description:
      "Contactanos por WhatsApp, email o visitanos en San Cayetano, Buenos Aires. Club Atlético Independiente.",
    url: "https://alboshop.com.ar/contact",
    images: [{ url: "/Club.jpg", alt: "Albo Shop — Club Atlético Independiente San Cayetano" }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
