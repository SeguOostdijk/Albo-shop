import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">

      {/* ADMIN HEADER */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Título centrado */}
          <h1 className="text-lg font-semibold">
            Panel de administración
          </h1>

          {/* espacio para equilibrio */}
          <div className="w-[140px]" />

        </div>
      </header>

      {/* CONTENIDO */}
      <main className="container mx-auto px-4 py-12 lg:py-16 no-newsletter">
        {children}
      </main>

    </div>
  )
}