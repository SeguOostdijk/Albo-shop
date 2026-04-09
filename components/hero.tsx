"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const heroSlides = [
    {
      image: "/Camiseta Nueva Hero.JPG",
      title: "NUEVA CAMISETA",
      subtitle: "Temporada 2025/26 ya disponible",
      cta: "COMPRAR AHORA",
      href: "/product/camiseta-blanca-de-juego-primera-division",
      eyebrow: "Colección oficial",
    },
  {
    image: "/salida.png",
    title: "PRIMERA DIVISION",
    subtitle: "La misma ropa que usan los jugadores",
    cta: "COMPRAR AHORA",
    href: "/category/primera-division",
    eyebrow: "Albo Shop",
  },
  {
    image: "/HeroFemenino.jpeg",
    title: "FEMENINO",
    subtitle: "La misma ropa que usan las jugadoras",
    cta: "VER COLECCIÓN",
    href: "/category/femenino",
    eyebrow: "Nueva temporada",
  },
  {
    image: "/Sponsors.jpeg",
    title: "Sponsors",
    subtitle: "¿Queres ser sponsor? Contactanos",
    cta: "CONTACTANOS",
    href: "/contact",
    eyebrow: "Sponsors",
  }
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
      {/* Mobile */}
      <section className="relative isolate block w-full max-w-full overflow-hidden bg-background md:hidden">
        <div className="relative h-[72vh] min-h-[420px] max-h-[720px] w-full overflow-hidden">
          {heroSlides.map((s, index) => (
            <div
              key={`mobile-${index}`}
              className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={s.image || "/placeholder.svg"}
                  alt={s.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center blur-[2px] scale-[1.04]"
                />
              </div>
            </div>
          ))}

          {/* overlays */}
          <div className="pointer-events-none absolute inset-0 bg-black/15" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />

          {/* content */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5 pb-6">
            <div className="max-w-[85%]">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                {slide.eyebrow}
              </p>

              <h1 className="text-3xl font-extrabold leading-[0.95] text-white">
                {slide.title}
              </h1>

              <p className="mt-3 max-w-[28ch] text-sm leading-5 text-white/85">
                {slide.subtitle}
              </p>

              <div className="mt-5">
                <Button
                  size="lg"
                  className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg"
                  asChild
                >
                  <Link href={slide.href}>{slide.cta}</Link>
                </Button>
              </div>

              <div className="mt-5 flex items-center gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Ir al slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop */}
      <div className="relative hidden h-[62vh] min-h-[440px] max-h-[700px] w-full overflow-hidden md:flex">
        <div className="flex h-full w-full">
          {/* Image side */}
          <div className="relative w-1/2 overflow-hidden bg-background">
            {heroSlides.map((s, index) => (
              <div
                key={`desktop-${index}`}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-600 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
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
            {/* Right edge fade into text panel */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />

            {/* Dots navigation */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={`desktop-dot-${index}`}
                  type="button"
                  aria-label={`Ir al slide ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === currentSlide ? "w-7 bg-white" : "w-2 bg-white/45"
                  } hover:w-5`}
                />
              ))}
            </div>
          </div>

          {/* Text side */}
          <div className="flex w-1/2 items-center justify-start bg-background px-12 lg:px-16">
            <div className="flex items-start gap-5">
              <div className="mt-1 w-1 self-stretch bg-primary rounded-full shrink-0" />
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {slide.eyebrow}
                </p>
                <h1 className="mb-4 text-4xl font-extrabold leading-tight text-foreground lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mb-8 text-base text-muted-foreground lg:text-lg">{slide.subtitle}</p>
                <Button
                  size="lg"
                  className="bg-primary px-8 py-5 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 rounded-xl transition-all duration-200"
                  asChild
                >
                  <Link href={slide.href}>{slide.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}