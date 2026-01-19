"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=800&fit=crop",
    title: "NUEVA CAMISETA",
    subtitle: "Temporada 2025/26 ya disponible",
    cta: "COMPRAR AHORA",
    href: "/product/camiseta-titular-2025",
  },
  {
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&h=800&fit=crop",
    title: "BOCA BASQUET",
    subtitle: "Nueva indumentaria de juego ya disponible",
    cta: "COMPRAR AHORA",
    href: "/category/basquet",
  },
  {
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&h=800&fit=crop",
    title: "ENTRENAMIENTO",
    subtitle: "La misma ropa que usan los jugadores",
    cta: "VER COLECCION",
    href: "/category/entrenamiento",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative h-[500px] md:h-[550px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {heroSlides.map((s, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image || "/placeholder.svg"}
              alt={s.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Content Panel */}
      <div className="absolute inset-0 flex">
        {/* Left side - image visible */}
        <div className="flex-1" />
        
        {/* Right side - White panel */}
        <div className="w-full md:w-[45%] bg-background flex items-center justify-center p-8 md:p-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8">
              {slide.subtitle}
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              asChild
            >
              <Link href={slide.href}>{slide.cta}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-primary" : "bg-primary/30"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
