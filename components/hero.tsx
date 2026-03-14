"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const heroSlides = [
  {
    image: "/campeonato.jpg",
    title: "NUEVA CAMISETA",
    subtitle: "Temporada 2025/26 ya disponible",
    cta: "COMPRAR AHORA",
    href: "/product/camiseta-titular-2025",
  },
  {
    image: "/salida.png",
    title: "PRIMERA DIVISION",
    subtitle: "La misma ropa que usan los jugadores",
    cta: "COMPRAR AHORA",
    href: "/category/primera-division",
  },
  {
    image: "/FutbolFemeninoHero.png",
    title: "FEMENINO",
    subtitle: "La misma ropa que usan las jugadoras",
    cta: "VER COLECCION",
    href: "/category/femenino",
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
    <section className="relative h-screen overflow-hidden">
      {/* Full background images */}
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
            className="object-cover object-center opacity-70 md:opacity-100"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl mx-auto w-full text-center md:text-left items-center md:items-start z-10">
        <div className="text-shadow">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-4 drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-lg md:text-2xl text-foreground/90 mb-8 max-w-md drop-shadow-md">
            {slide.subtitle}
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg shadow-2xl drop-shadow-lg"
            asChild
          >
            <Link href={slide.href}>{slide.cta}</Link>
          </Button>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer shadow-lg ${
              index === currentSlide ? "bg-primary scale-125 shadow-primary/50" : "bg-white/80 hover:bg-primary/80"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
