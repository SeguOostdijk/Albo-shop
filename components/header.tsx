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
import { categories, subcategories } from "@/lib/type/products"
import type { Product } from "@/lib/type/products"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchResults } from "@/components/search-results"

const mainNavCategories = categories.filter(
  (cat) => ["primera-division", "femenino", "infantiles", "accesorios"].includes(cat.slug)
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
      {/* Top Yellow Banner */}
      <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
        <p>25% de reintegro + 3 cuotas sin interes pagando con tarjetas de credito Visa BBVA</p>
      </div>

      {/* Main Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-primary text-primary-foreground">
                <nav className="flex flex-col gap-2 mt-8">
                  <Link
                    href="/category/novedades"
                    className="text-lg font-medium text-accent hover:text-accent/80 transition-colors block py-2 border-b border-primary-foreground/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    NOVEDADES
                  </Link>

                  {mainNavCategories.map((cat) => (
                    <div key={cat.slug} className="border-b border-primary-foreground/20 pb-2">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-lg font-medium hover:text-accent transition-colors block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.name.toUpperCase()}
                      </Link>

                      {cat.slug !== "accesorios" && (
                        <div className="flex flex-col gap-1 pl-4">
                          {subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/category/${cat.slug}?tipo=${sub.slug}`}
                              className="text-sm text-primary-foreground/80 hover:text-accent transition-colors py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <Link
                    href="/category/oportunidades"
                    className="text-lg font-medium text-accent hover:text-accent/80 transition-colors block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    OPORTUNIDADES
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                <Image
                  src="/escudo.jpeg"
                  alt="Escudo Albo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-primary">Albo</span>
                <span className="font-light text-lg text-primary ml-1">Shop</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex relative flex-1 max-w-lg">
              <div className="relative w-full flex">
                <Input
                  type="search"
                  placeholder="Buscar"
                  className="w-full border-2 border-border rounded-l-sm rounded-r-none focus-visible:ring-0 focus-visible:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
                <Button className="rounded-l-none rounded-r-sm bg-background border-2 border-l-0 border-border hover:bg-muted cursor-pointer">
                  <Search className="h-5 w-5 text-foreground" />
                </Button>

                {searchOpen && searchLoading && (
                  <div className="absolute top-full left-0 right-0 bg-background border border-border mt-1 rounded-md p-3 text-sm text-muted-foreground z-50">
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
            <div className="flex items-center gap-1">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary hover:bg-primary/10 cursor-pointer"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-primary hover:bg-primary/10 cursor-pointer"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                      {wishlistItems}
                    </span>
                  )}
                  <span className="sr-only">Favoritos</span>
                </Button>
              </Link>

              {/* Account */}
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 cursor-pointer">
                <User className="h-5 w-5" />
                <span className="sr-only">Mi cuenta</span>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-primary hover:bg-primary/10 cursor-pointer"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                    {cartItems}
                  </span>
                )}
                <span className="sr-only">Carrito</span>
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <div className="md:hidden pb-4 relative">
              <div className="relative flex">
                <Input
                  type="search"
                  placeholder="Buscar"
                  className="w-full border-2 border-border rounded-l-sm rounded-r-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button className="rounded-l-none rounded-r-sm bg-background border-2 border-l-0 border-border hover:bg-muted cursor-pointer">
                  <Search className="h-5 w-5 text-foreground" />
                </Button>

                {searchLoading && (
                  <div className="absolute top-full left-0 right-0 bg-background border border-border mt-1 rounded-md p-3 text-sm text-muted-foreground z-50">
                    Buscando...
                  </div>
                )}

                {searchResults.length > 0 && (
                  <SearchResults
                    results={searchResults.slice(0, 5)}
                    onSelect={() => {
                      setSearchQuery("")
                      setSearchOpen(false)
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="hidden lg:block bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-0">
            <Link
              href="/category/novedades"
              className="px-5 py-3 text-sm font-medium text-accent hover:bg-primary/80 transition-colors"
            >
              NOVEDADES
            </Link>

            {mainNavCategories.map((cat) => (
              <div key={cat.slug} className="relative group">
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1 px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
                >
                  {cat.name.toUpperCase()}
                  {cat.slug !== "accesorios" && <ChevronDown className="h-4 w-4" />}
                </Link>

                {cat.slug !== "accesorios" && (
                  <div className="absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-background text-foreground shadow-lg border border-border min-w-[200px] py-2">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/category/${cat.slug}?tipo=${sub.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/category/oportunidades"
              className="px-5 py-3 text-sm font-medium text-accent hover:bg-primary/80 transition-colors"
            >
              OPORTUNIDADES
            </Link>
          </div>
        </div>
      </nav>

      <CartDrawer />
    </header>
  )
}