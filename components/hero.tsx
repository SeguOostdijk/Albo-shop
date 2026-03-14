
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
    <>
      {/* Mobile: Overlay hero with fixed aspect ratio */}
      <div className="md:hidden relative w-full h-[70vh] min-h-[350px] max-h-[600px] overflow-hidden bg-background">
        {heroSlides.map((s, index) => (
          <div
            key={`mobile-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 touch-scroll ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image || "/placeholder.svg"}
              alt={s.title}
              fill
              className="object-cover object-center opacity-85"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-8 z-10 text-center">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 drop-shadow-2xl leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg text-foreground/95 mb-6 drop-shadow-lg px-4">
              {slide.subtitle}
            </p>
            <Button size="lg" className="shadow-xl drop-shadow-lg px-10 py-6 text-base font-semibold" asChild>
              <Link href={slide.href}>{slide.cta}</Link>
            </Button>
          </div>
        </div>
        {/* Dots removidos */}
      </div>

      {/* Desktop: Overlay hero con imagen y contenido 50/50 */}
      <div className="hidden md:flex relative w-full h-[80vh] min-h-[520px] max-h-[900px] overflow-hidden">
        <div className="w-full h-full flex">
          {/* Imagen 50% */}
          <div className="w-1/2 relative overflow-hidden bg-background">
            {heroSlides.map((s, index) => (
              <div
                key={`desktop-${index}`}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } flex items-center justify-center`}
              >
                <Image
                  src={s.image || "/placeholder.svg"}
                  alt={s.title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
          {/* Contenido 50% */}
          <div className="w-1/2 bg-background/80 flex items-center justify-center p-12">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                {slide.title}
              </h1>
              <p className="text-2xl text-foreground/80 mb-10">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-lg shadow-lg"
                asChild
              >
                <Link href={slide.href}>{slide.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Dots removidos */}
      </div>
    </>
  )
}

