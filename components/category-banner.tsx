import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

const categoryBanners = [
  {
    title: "PRIMERA DIVISION",
    image: "/PrimeraDivision.png",
    href: "/category/primera-division", 
  },
  {
    title: "FEMENINO",
    image: "/Femenino.png",
    href: "/category/femenino",
  },
  {
    title: "INFANTILES",
    image: "/Infantiles.png",
    href: "/category/infantiles",
  },
]

export function CategoryBanner() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Mobile: Single column */}
        <div className="md:hidden grid grid-cols-1 gap-8 max-w-md mx-auto">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-muted/30"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-primary/95 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8 px-4">
                <h3 className="text-3xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
                  {category.title}
                </h3>
                <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-yellow-400 rounded-full shadow-md" />
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: 3 columns single row */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 w-full">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-muted/30 hover:from-muted"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/95 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8 px-4">
                <h3 className="text-3xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
                  {category.title}
                </h3>
                <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-yellow-400 rounded-full shadow-md" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
