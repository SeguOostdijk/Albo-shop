"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

interface ProductCarouselProps {
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
  showDots?: boolean
}

export function ProductCarousel({ title, subtitle, products, viewAllHref, showDots = true }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        {/* Header - Boca style with blue left border */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-0">
            <div className="w-1 h-14 bg-primary mr-4" />
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider">{subtitle || "OPORTUNIDADES"}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-accent uppercase">{title}</h2>
            </div>
          </div>
          
          {/* Dot indicators and navigation */}
          <div className="flex items-center gap-4">
            {showDots && (
              <div className="hidden md:flex gap-1">
                {[...Array(Math.min(6, products.length))].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < 4 ? "bg-primary" : "bg-border"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carousel with navigation arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-background shadow-lg border border-border hover:bg-muted hidden md:flex"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Anterior</span>
          </Button>

          {/* Products */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] md:w-[300px] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-background shadow-lg border border-border hover:bg-muted hidden md:flex"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Siguiente</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
