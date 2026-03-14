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
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-[1600px] mx-auto">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[5/7] h-[550px] md:h-[650px] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border-2 border-border/20 hover:border-primary/70 mx-auto md:mx-0 block"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-100 group-hover:brightness-105"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
