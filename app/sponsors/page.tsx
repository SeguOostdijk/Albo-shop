"use client"

import { useState, useEffect } from "react"
import { SponsorsGrid } from "@/components/sponsors-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Users, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-8 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            Club Atlético Independiente
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-5 tracking-tight leading-[1.05]">
            SPONSORS
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Apoyá a los comercios que acompañan al club y accedé a{" "}
            <span className="font-semibold text-foreground">descuentos exclusivos para socios</span>.
          </p>
        </div>

        {/* Sponsors Grid */}
        {sponsors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-16 md:mb-24">
            <SponsorsGrid sponsors={sponsors} />
          </div>
        ) : (
          <div className="text-center py-20 mb-16 text-muted-foreground">
            <p className="text-lg">Próximamente...</p>
          </div>
        )}

        {/* Associate CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 p-8 md:p-12 text-center mb-10">
          <Users className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
            ¿Todavía no sos socio?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Asociate al club y accedé a descuentos de hasta el 30% en la tienda oficial y en todos nuestros sponsors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="font-bold px-8 py-6 rounded-2xl shadow-lg hover:scale-[1.03] transition-all">
              <Link href="/sponsors/associate" className="flex items-center gap-2">
                Asociate ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 rounded-2xl font-semibold">
              <Link href="/">Volver a la tienda</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
