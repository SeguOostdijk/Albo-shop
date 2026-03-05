"use client"

import { useEffect, useState, useRef } from "react"
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

// Subcategorías para cada categoría principal
const categorySubcategories: Record<string, typeof subcategories> = {
  "primera-division": subcategories,
  "femenino": subcategories,
  "infantiles": subcategories,
  "accesorios": [],
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const cartItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items.length)
  const openCart = useCartStore((state) => state.openCart)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Live Search con debounce
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

  const handleMouseEnter = (slug: string) => {
    if (categorySubcategories[slug]?.length > 0) {
      setOpenDropdown(slug)
    }
  }

  const handleMouseLeave = () => {
    setOpenDropdown(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Banner */}
      <div className="bg-[#0f2f98] text-white text-center py-2 text-sm font-medium">
        <p>25% de reintegro + 3 cuotas sin interes pagando con tarjetas Visa BBVA</p>
      </div>

      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#0f2f98] text-white">
                <nav className="flex flex-col gap-2 mt-8">
                  {mainNavCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-white hover:underline"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0f2f98] flex items-center justify-center">
                <Image
                  src="/escudo.jpeg"
                  alt="Escudo"
                  width={48}
                  height={48}
                />
              </div>
              <span className="font-bold text-xl text-[#0f2f98]">Albo Shop</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex relative flex-1 max-w-lg">
              <div className="relative w-full flex">
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  className="pr-12"
                />
                <Button className="absolute right-0 top-0 bottom-0 bg-[#0f2f98] hover:bg-[#0a2475]">
                  <Search className="h-5 w-5" />
                </Button>

                {searchOpen && searchLoading && (
                  <div className="absolute top-full left-0 w-full bg-background border p-3 text-sm shadow-lg">
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
              {/* Mi Cuenta */}
              <Link href="/account">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="cursor-pointer hover:bg-[#0f2f98]/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/wishlist" className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="cursor-pointer hover:bg-[#0f2f98]/10"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={openCart}
                className="cursor-pointer hover:bg-[#0f2f98]/10 relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar - Desktop */}
      <div className="bg-[#0f2f98] hidden lg:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-1 h-12" ref={dropdownRef}>
            {mainNavCategories.map((cat) => (
              <div 
                key={cat.slug}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1 px-4 py-2 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {cat.name}
                  {categorySubcategories[cat.slug]?.length > 0 && (
                    <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === cat.slug ? 'rotate-180' : ''}`} />
                  )}
                </Link>
                
                {/* Dropdown de subcategorías */}
                {openDropdown === cat.slug && categorySubcategories[cat.slug]?.length > 0 && (
                  <div className="absolute top-full left-0 bg-white shadow-lg border rounded-md py-2 min-w-[180px] z-50">
                    {categorySubcategories[cat.slug].map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${cat.slug}?tipo=${sub.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#0f2f98]/5 hover:text-[#0f2f98] cursor-pointer"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <CartDrawer />
    </header>
  )
}
