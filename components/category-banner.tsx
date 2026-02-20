import Link from "next/link"
import Image from "next/image"

const categoryBanners = [
  {
    title: "  ",
    image: "/PrimeraDivision.png",
    href: "/category/hombre",
  },
  {
    title: " ",
    image: "/Femenino.png",
    href: "/category/mujer",
  },
  {
    title: "",
    image: "/Infantiles.png",
    href: "/category/ninos",
  },
]

export function CategoryBanner() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryBanners.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/90 to-transparent" />
              
              {/* Title with yellow underline */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  {category.title}
                </h3>
                <div className="w-16 h-1 bg-accent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
