"use client"

import Image from 'next/image'
import Link from 'next/link'

interface PromoBannerProps {
  imageSrc: string
  altText: string
  linkUrl: string
  target?: string
}

export function PromoBanner({ imageSrc, altText, linkUrl, target = '_self' }: PromoBannerProps) {
  return (
    <section className='py-6'>
      <div className='container mx-auto px-4'>
        <Link href={linkUrl} target={target} className='block group max-w-4xl mx-auto'>
          <div className='relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 w-full aspect-[3/4] max-h-[500px]'>
            <Image
              src={imageSrc}
              alt={altText}
              width={600}
              height={800}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent' />
            <div className='absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10'>
              <h3 className='text-2xl md:text-4xl font-bold text-white drop-shadow-2xl mb-3'>
         
              </h3>
              <p className='text-lg md:text-2xl text-white/95 drop-shadow-xl font-semibold'>
                Click para más info
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}


