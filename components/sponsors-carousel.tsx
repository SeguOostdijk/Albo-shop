"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface SponsorSlide {
  src: string
  alt: string
  href: string
  isNormal: boolean
}

export function SponsorsCarousel() {
  const [sponsors, setSponsors] = useState<SponsorSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
.from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('position')


      const dynamicSponsors: SponsorSlide[] = data?.map((s: any) => ({
        src: s.image,
        alt: s.name,
        href: s.url || '#',
        isNormal: true
      })) || []

      // Agregar slide final "Todos sponsors"
      const allSponsors: SponsorSlide[] = [
        ...dynamicSponsors,
        {
          src: '/salida.jpg',
          alt: 'Todos los Sponsors',
          href: '/sponsors',
          isNormal: false
        }
      ]

      setSponsors(allSponsors)
    } catch (error) {
      console.error('Error fetching sponsors:', error)
      // Fallback sponsors
      setSponsors([
        { src: '/salida.jpg', alt: 'Salida', href: '/promotions/salida', isNormal: true },
        { src: '/vuelta.jpg', alt: 'Vuelta', href: '/promotions/vuelta', isNormal: true },
        { src: '/campeonato.jpg', alt: 'Campeonato', href: '/promotions/campeonato', isNormal: true },
        { src: '/ViaMas.png', alt: 'ViaMas', href: '/promotions/viamas', isNormal: true },
        { src: '/salida.jpg', alt: 'Todos los Sponsors', href: '/sponsors', isNormal: false }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sponsors.length === 0 || loading) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [sponsors.length, loading])

  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % sponsors.length)

  const currentSponsor = sponsors[currentIndex]
  const isFinalSlide = !currentSponsor?.isNormal

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando sponsors...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-12 md:pt-16 lg:pt-20 py-20 md:py-32 lg:py-40 bg-muted pb-32 md:pb-40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent mb-6">
            Nuestros Sponsors
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Apoya a los mejores sponsors del club
          </p>
        </div>

        <div className="relative">
          {/* Indicators */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {Array.from({length: sponsors.length}, (_, i) => i).map((index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={` 
                  w-3 h-3 rounded-full transition-all duration-300 cursor-pointer bg-primary/70 hover:bg-primary
                  ${index === currentIndex ? 'w-8 bg-primary scale-110 shadow-lg shadow-primary/50' : 'hover:bg-primary'}
                `}
              />
            ))}
          </div>

          {/* Main Image Container */}
          <div className="relative mx-auto max-w-4xl aspect-[16/9] rounded-3xl shadow-2xl overflow-hidden">
            {!isFinalSlide ? (
              /* Normal Sponsor Slide */
<Link 
                href={currentSponsor.href} 
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full hover:scale-105 transition-all duration-500 group relative"
              >

                <Image
                  src={currentSponsor.src}
                  alt={currentSponsor.alt}
                  fill
                  className="object-cover group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority={currentIndex < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-xl mb-1 leading-tight">
                    {currentSponsor.alt}
                  </h3>
                  <p className="text-sm md:text-base text-white/90 drop-shadow-md font-medium">
                    Click para promociones
                  </p>
                </div>
              </Link>
            ) : (
              /* Final Blurred Slide - Todos Sponsors */
              <div className="relative h-full">
                <Image
                  src={currentSponsor.src}
                  alt="Todos los Sponsors"
                  fill
                  className="object-cover blur-sm brightness-[0.7]"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                  <div className="mb-6">
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white/95 drop-shadow-2xl mb-4 tracking-tight leading-none">
                      TODOS
                    </h3>
                    <div className="w-24 h-px bg-gradient-to-r from-primary via-accent to-primary mx-auto mb-6 opacity-80" />
                    <p className="text-lg md:text-xl lg:text-2xl font-light text-white/90 drop-shadow-xl max-w-md mx-auto leading-relaxed">
                      Nuestros Sponsors
                    </p>
                  </div>
                  
                  <Button 
                    size="lg" 
                    asChild
                    className="bg-gradient-to-r from-primary via-accent to-primary/90 hover:from-primary hover:to-accent 
                               text-primary-foreground font-semibold px-10 py-6 text-base md:text-lg shadow-2xl 
                               hover:shadow-3xl hover:scale-[1.05] border border-white/30 rounded-xl
                               backdrop-blur-sm transition-all duration-300"
                  >
                    <Link href="/sponsors">Ver Todos</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 
                         backdrop-blur-sm border border-white/40 rounded-full p-1.5 shadow-lg cursor-pointer
                         transition-all duration-200 hover:scale-110"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-5 w-5 text-white drop-shadow-md" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 
                         backdrop-blur-sm border border-white/40 rounded-full p-1.5 shadow-lg cursor-pointer
                         transition-all duration-200 hover:scale-110"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5 text-white drop-shadow-md" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
