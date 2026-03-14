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
      {/* Mobile: Shorter overlay hero, scrollable */}
      <div className="md:hidden relative h-[70vh] min-h-[450px] overflow-hidden">
        {/* Images */}
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
            />
          </div>
        ))}
        {/* Light gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
        {/* Centered content */}
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
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 p-2">
          {heroSlides.map((_, index) => (
            <button
              key={`mobile-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer touch-manipulation ${
                index === currentSlide ? "bg-primary scale-125 shadow-primary" : "bg-white/90 hover:bg-primary/80"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Original split layout */}
      <div className="hidden md:flex relative h-[600px] lg:h-[700px] overflow-hidden">
        <div className="w-full h-full flex">
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
          <div className="w-[55%] bg-background flex items-center justify-center p-12">
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

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={`desktop-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? "bg-primary scale-125 shadow-lg" : "bg-primary/40 hover:bg-primary"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

