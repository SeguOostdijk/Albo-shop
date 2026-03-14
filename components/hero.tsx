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
      {/* Mobile: Full overlay hero */}
      <div className="md:hidden relative h-screen min-h-[500px] overflow-hidden">
        {/* Images */}
        {heroSlides.map((s, index) => (
          <div
            key={`mobile-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image || "/placeholder.svg"}
              alt={s.title}
              fill
              className="object-cover object-center opacity-80"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent" />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 z-10 text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 drop-shadow-2xl leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl text-foreground/90 mb-8 drop-shadow-xl">
              {slide.subtitle}
            </p>
            <Button size="lg" className="shadow-2xl drop-shadow-lg px-12 py-8 text-lg" asChild>
              <Link href={slide.href}>{slide.cta}</Link>
            </Button>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={`mobile-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-primary scale-125 shadow-lg" : "bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Original side-by-side */}
      <div className="hidden md:block md:h-[600px] lg:h-[700px] relative overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Left image */}
          <div className="flex-1 relative overflow-hidden">
            {heroSlides.map((s, index) => (
              <div
                key={`desktop-${index}`}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={s.image || "/placeholder.svg"}
                  alt={s.title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          
          {/* Right content */}
          <div className="w-[45%] bg-background flex items-center justify-center p-12">
            <div className="text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-2xl text-foreground/80 mb-8">
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

        {/* Desktop dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={`desktop-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                index === currentSlide ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

