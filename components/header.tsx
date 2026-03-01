"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { categories, subcategories } from "@/lib/types/products"
import type { Product } from "@/lib/types/products"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchResults } from "@/components/search-results"

const mainNavCategories = categories.filter(
  (cat) =>
    ["primera-division", "femenino", "infantiles", "accesorios"].includes(cat.slug)
)

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const cartItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items.length)
  const openCart = useCartStore((state) => state.openCart)

  // 🔥 Live Search con debounce
  useEffect(() => {
    const q = searchQuery.trim()

    if (q.length < 2) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    const id = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const json = await res.json()
        setSearchResults(json.ok ? json.data : [])
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => clearTimeout(id)
  }, [searchQuery])

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banner */}
      <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
        <p>25% de reintegro + 3 cuotas sin interes pagando con tarjetas Visa BBVA</p>
      </div>

      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-primary text-primary-foreground">
                <nav className="flex flex-col gap-2 mt-8">
                  {mainNavCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                <Image
                  src="/escudo.jpeg"
                  alt="Escudo"
                  width={48}
                  height={48}
                />
              </div>
              <span className="font-bold text-xl text-primary">Albo Shop</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex relative flex-1 max-w-lg">
              <div className="relative w-full flex">
                <Input
                  type="search"
                  placeholder="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
                <Button>
                  <Search className="h-5 w-5" />
                </Button>

                {searchOpen && searchLoading && (
                  <div className="absolute top-full left-0 w-full bg-background border p-3 text-sm">
                    Buscando...
                  </div>
                )}

                {searchOpen && searchResults.length > 0 && (
                  <SearchResults
                    results={searchResults.slice(0, 5)}
                    onSelect={() => setSearchQuery("")}
                  />
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                  {wishlistItems > 0 && (
                    <span className="absolute text-xs">{wishlistItems}</span>
                  )}
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={openCart}>
                <ShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute text-xs">{cartItems}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  )
}