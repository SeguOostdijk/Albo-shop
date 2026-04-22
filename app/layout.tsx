import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://alboshop.com.ar"),
  verification: {
    google: "PHjEMbhguo466EYI-CfTaqTS4jPMWxYeRiGo4ZiR6i4",
  },
  title: {
    default: "Albo Shop | Tienda Oficial Club Atlético Independiente San Cayetano",
    template: "%s | Albo Shop",
  },
  description:
    "Tienda oficial del Club Atlético Independiente de San Cayetano. Camisetas, indumentaria deportiva, accesorios y productos exclusivos del club. Enviamos a todo el país.",
  keywords: [
    "Club Atlético Independiente",
    "San Cayetano",
    "Albo Shop",
    "tienda oficial",
    "camisetas futbol",
    "indumentaria deportiva",
    "accesorios club",
    "Buenos Aires",
  ],
  openGraph: {
    siteName: "Albo Shop",
    locale: "es_AR",
    type: "website",
    title: "Albo Shop | Tienda Oficial Club Atlético Independiente San Cayetano",
    description:
      "Camisetas, indumentaria y accesorios oficiales del Club Atlético Independiente de San Cayetano.",
    images: [
      {
        url: "/Club.jpg",
        width: 1200,
        height: 630,
        alt: "Albo Shop — Tienda Oficial Club Atlético Independiente San Cayetano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Albo Shop | Tienda Oficial Club Atlético Independiente San Cayetano",
    description:
      "Camisetas, indumentaria y accesorios oficiales del Club Atlético Independiente de San Cayetano.",
    images: ["/Club.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: "#1a365d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <html lang="es" style={{overflow: 'visible'}} className="overscroll-none">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Header />
          <SidebarProvider>
            <SidebarInset className="min-h-screen pt-0">
              <main>{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Footer />
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
