import Link from "next/link"
import { Shirt, Snowflake } from "lucide-react"

// Custom Bermuda shorts icon
function BermudaIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 4h12v2l-1 12h-4l-1-8-1 8H7L6 6V4z" />
      <path d="M6 4h12" />
      <path d="M8 4v2" />
      <path d="M16 4v2" />
    </svg>
  )
}

// Custom Cap/Gorra icon
function CapIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 14c0-3 2-6 9-6s9 3 9 6" />
      <path d="M3 14c0 2 4 4 9 4s9-2 9-4" />
      <path d="M12 8V6" />
      <circle cx="12" cy="5" r="1" />
      <path d="M21 14l1 2" />
    </svg>
  )
}

const categoryIcons = [
  {
    name: "Camisetas",
    icon: Shirt,
    href: "/category/hombre?tipo=remeras",
  },
  {
    name: "Abrigos",
    icon: Snowflake,
    href: "/category/hombre?tipo=buzos",
  },
  {
    name: "Pantalones y shorts",
    icon: BermudaIcon,
    href: "/category/hombre?tipo=pantalones",
  },
  {
    name: "Accesorios",
    icon: CapIcon,
    href: "/category/accesorios",
  },
]

export function CategoryIcons() {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categoryIcons.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-3 group"
            >
              {/* Icon with blue ring */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary flex items-center justify-center bg-background group-hover:bg-primary/10 transition-colors">
                <category.icon className="w-10 h-10 md:w-12 md:h-12 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
