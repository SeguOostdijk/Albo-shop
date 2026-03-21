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
  title: {
    default: "Club Shop | Tienda Oficial",
    template: "%s | Club Shop",
  },
  description:
    "Tienda oficial del club. Encontra camisetas, indumentaria deportiva, accesorios y mas productos exclusivos.",
  keywords: ["futbol", "camisetas", "club", "tienda oficial", "indumentaria deportiva"],
    generator: 'v0.app'
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
