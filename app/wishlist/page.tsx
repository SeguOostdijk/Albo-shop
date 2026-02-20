"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { useWishlistStore } from "@/lib/wishlist-store"

export default function WishlistPage() {
  const { items } = useWishlistStore()

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Favoritos" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Mis Favoritos</h1>

      {items.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Tu lista esta vacia</h2>
          <p className="text-muted-foreground mb-8">
            Guarda tus productos favoritos para encontrarlos mas facil
          </p>
          <Button asChild>
            <Link href="/category/hombre">Explorar Productos</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            {items.length} {items.length === 1 ? "producto" : "productos"} en tu lista
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
