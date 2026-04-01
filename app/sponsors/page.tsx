"use client"

import { useState, useEffect } from "react"
import { SponsorsGrid } from "@/components/sponsors-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("sponsors")
      .select("*")
      .eq("is_active", true)
      .order("position")
      .then(({ data }) => setSponsors(data || []))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 sm:mb-6 tracking-tight leading-[1.05] md:leading-tight">
            SPONSORS
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-1 sm:px-0">
            Apoyá a nuestros sponsors oficiales y descubrí ofertas exclusivas para socios del club.
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-14 md:mb-20">
          <SponsorsGrid sponsors={sponsors} />
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link href="/" className="inline-block cursor-pointer w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-6 sm:px-10 md:px-12 py-6 sm:py-7 md:py-8 text-base sm:text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] rounded-2xl border border-transparent hover:border-white/20 cursor-pointer"
            >
              Volver a Tienda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}