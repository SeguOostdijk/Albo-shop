import Link from "next/link"
import Image from "next/image"

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
        <div className="grid grid-cols-3 gap-4 md:gap-6 w-full">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/90 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6 px-4">
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
                  {category.title}
                </h3>
                <div className="w-16 md:w-20 h-1 bg-accent rounded-full shadow-sm" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
