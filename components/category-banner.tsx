import Link from "next/link"
import Image from "next/image"

const categoryBanners = [
  {
    title: "PRIMERA DIVISION",
    image: "/PrimeraDivision.png",
    imageMobile: "/PrimeraDivisionMobile.png",
    href: "/category/primera-division",
  },
  {
    title: "FEMENINO",
    image: "/Femenino.png",
    imageMobile: "/FemeninoMobile.png",
    href: "/category/femenino",
  },
  {
    title: "INFANTILES",
    image: "/Infantiles.png",
    imageMobile: "/InfantilesMobile.png",
    href: "/category/infantiles",
  },
]

export function CategoryBanner() {
  return (
    <section className="bg-background py-8 md:py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {categoryBanners.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative mx-auto block w-full max-w-[420px] overflow-hidden rounded-xl border border-border/20 shadow-lg transition-all duration-500 hover:scale-105 hover:border-primary/70 hover:shadow-xl md:mx-0 md:max-w-none"
            >
              <div className="relative aspect-[3/3] md:aspect-[5/7] md:h-[650px] md:min-h-0">

                {/* Mobile */}
                <Image
                  src={category.imageMobile || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105 md:hidden"
                />

                {/* Desktop */}
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105 hidden md:block"
                />

              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}