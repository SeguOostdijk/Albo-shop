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
        {/* Mobile: 1 column, smaller */}
        <div className="md:hidden grid grid-cols-1 gap-20 max-w-lg mx-auto py-12">


          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto block"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6 px-4">
                <h3 className="text-2xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
                  {category.title}
                </h3>
                <div className="w-20 h-1 bg-accent rounded shadow-sm" />
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: original 3 col */}
        <div className="grid md:grid-cols-3 md:gap-6 w-full">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/90 to-transparent" />
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
