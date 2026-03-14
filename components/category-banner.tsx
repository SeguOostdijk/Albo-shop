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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-[1600px] mx-auto">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-[5/7] h-[550px] md:h-[650px] overflow-hidden rounded-3xl shadow-xl hover:shadow-xl transition-all duration-700 hover:scale-110 border-4 border-border/20 hover:border-primary/70 mx-auto md:mx-0 block"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 brightness-100 group-hover:brightness-105"
              />
              <div className="absolute inset-x-0 bottom-8 md:bottom-12 bg-white/90 backdrop-blur-sm px-4 md:px-6 py-3 rounded-xl shadow-lg border">
                <h3 className="text-3xl md:text-4xl font-black text-primary leading-none mb-1 text-center tracking-tight">
                  {category.title}
                </h3>
                <div className="w-40 md:w-48 h-1.5 bg-gradient-to-r from-accent to-yellow-400 rounded-xl mx-auto shadow-md" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
