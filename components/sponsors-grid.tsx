"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Star, Crown } from 'lucide-react'

interface Sponsor {
  name: string
  image: string
  url: string
  type?: 'principal' | 'oficial' | 'logistica'
  description?: string
}

interface SponsorsGridProps {
  sponsors?: Sponsor[]
}

export function SponsorsGrid({ sponsors = [] }: SponsorsGridProps) {
  return (
    <>
      {sponsors.map((sponsor) => (
        <Link 
          key={sponsor.name}
          href={sponsor.url}
          className="group relative overflow-hidden rounded-2xl bg-background/50
                     border border-border/50 hover:border-primary/50 
                     shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500
                     aspect-[4/3] md:aspect-[5/4] cursor-pointer"
        >
          <div className="relative h-full w-full">
            <Image
              src={sponsor.image}
              alt={sponsor.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          
          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            {sponsor.type === 'principal' && (
              <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Crown className="w-3 h-3" />
                Principal
              </div>
            )}
            {sponsor.type === 'oficial' && (
              <div className="bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Oficial
              </div>
            )}
            {sponsor.type === 'logistica' && (
              <div className="bg-muted/90 text-muted-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Logística
              </div>
            )}
          </div>

          {/* Content */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-2xl mb-2 group-hover:text-primary transition-colors">
              {sponsor.name}
            </h3>
            {sponsor.description && (
              <p className="text-sm md:text-base text-white/90 drop-shadow-lg font-medium mb-4 max-w-[20ch] line-clamp-2">
                {sponsor.description}
              </p>
            )}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-md" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                Ofertas exclusivas
              </span>
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
