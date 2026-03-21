"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  LogOut,
  Pencil,
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { categories, subcategories } from "@/lib/type/products"
import type { Product } from "@/lib/type/products"

const extrasSubcategories = [
  { name: "Accesorios", slug: "accesorios" },
  { name: "Ropa", slug: "ropa" },
];

import { CartDrawer } from "@/components/cart-drawer"
import { SearchResults } from "@/components/search-results"

const mainNavCategories = categories.filter((cat) =>
  ["primera-division", "femenino", "infantiles", "accesorios", "extras"].includes(cat.slug)
)

export function Header() {
  const [searchOpenMobile, setSearchOpenMobile] = useState(false)
  const [searchOpenDesktop, setSearchOpenDesktop] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  const { user, signOut } = useAuth()
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

  useEffect(() => {
    const checkAdmin = async () => {
      setIsAdminUser(false)

      if (!user) return

      const supabase = createClient()

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!error && data?.role === "admin") {
        setIsAdminUser(true)
      }
    }

    checkAdmin()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-[9999] w-full bg-background/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] isolate">
      <div className="bg-accent px-3 py-2 text-center text-xs font-medium text-accent-foreground sm:text-sm">
        <p className="line-clamp-2 sm:line-clamp-1">
          25% de reintegro + 3 cuotas sin interes pagando con tarjetas de credito Visa BBVA
        </p>
      </div>

      <div className="bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-3 lg:gap-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
<div className="relative lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="z-[101]"
                  onClick={() => setSheetOpen(prev => !prev)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              {sheetOpen && (
                <motion.div 
className="lg:hidden fixed left-0 top-0 h-screen z-[100] bg-primary text-primary-foreground border-r border-primary/20 shadow-2xl w-[80vw] max-w-md rounded-r-2xl p-6"
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '-100%', opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <nav className="flex flex-col gap-3">
                    {mainNavCategories.map((cat) => (
                      <div key={cat.slug} className="border-b border-primary-foreground/20 pb-2">
                        <Link
                          href={`/category/${cat.slug}`}
                          className="block px-3 py-2.5 text-lg font-bold text-white border-l-2 border-accent/60 hover:border-accent hover:bg-white/10 rounded-r-lg transition-colors"
                          onClick={() => setSheetOpen(false)}
                        >
                          {cat.name.toUpperCase()}
                        </Link>

                        {cat.slug !== "accesorios" && (
                          <div className="flex flex-col gap-1 pl-4">
                            {(cat.slug === "extras" ? extrasSubcategories : subcategories).map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/category/${cat.slug}?tipo=${sub.slug}`}
                                className="block px-4 py-2 text-base text-white/90 hover:text-white hover:bg-white/5 rounded-md transition-colors ml-3"
                                onClick={() => setSheetOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {isAdminUser && (
                      <Link
                        href="/admin"
                        className="mt-2 block border-t border-primary-foreground/20 py-2 text-lg font-medium text-white transition-colors hover:text-accent"
                        onClick={() => setSheetOpen(false)}
                      >
                        EDITAR CATÁLOGO
                      </Link>
                    )}
                  </nav>
                </motion.div>
              )}

              <Link href="/" className="flex min-w-0 items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary sm:h-12 sm:w-12">
                  <Image
                    src="/escudo.jpeg"
                    alt="Escudo Albo"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-lg font-bold text-primary sm:text-xl">Albo</span>
                  <span className="ml-1 text-base font-light text-primary sm:text-lg">Shop</span>
                </div>
              </Link>
            </div>

            <div className="relative hidden max-w-xl flex-1 md:flex">
              <div className="relative w-full">
                <div className="flex">
                  <Input
                    type="search"
                    placeholder="Buscar productos"
                    className="w-full rounded-l-sm rounded-r-none border-2 border-border text-foreground focus-visible:border-primary focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpenDesktop(true)}
                    onBlur={() => setTimeout(() => setSearchOpenDesktop(false), 200)}
                  />
                  <Button
                    type="button"
                    className="cursor-pointer rounded-l-none rounded-r-sm border-2 border-l-0 border-border bg-background hover:bg-muted"
                  >
                    <Search className="h-5 w-5 text-foreground" />
                  </Button>
                </div>

                {searchOpenDesktop && searchLoading && (
                  <div className="absolute left-0 right-0 top-full z-[10005] mt-1 rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
                    Buscando...
                  </div>
                )}

                {searchOpenDesktop && searchResults.length > 0 && (
                  <SearchResults
                    results={searchResults.slice(0, 5)}
                    onSelect={() => {
                      setSearchQuery("")
                      setSearchOpenDesktop(false)
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {isAdminUser && (
                <Link href="/admin" className="hidden xl:block">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar catálogo
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpenMobile((prev) => !prev)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Button>

              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                      {wishlistItems}
                    </span>
                  )}
                  <span className="sr-only">Favoritos</span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-w-0 flex-shrink"
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Mi cuenta</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[10030]">
                    <DropdownMenuLabel className="truncate">
                      {user.email}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">Mis Pedidos</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Mis Favoritos</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/account">Mi Cuenta</Link>
                    </DropdownMenuItem>

                    {isAdminUser && (
                      <DropdownMenuItem asChild className="xl:hidden">
                        <Link href="/admin">Editar catálogo</Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Mi cuenta</span>
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                    {cartItems}
                  </span>
                )}
                <span className="sr-only">Carrito</span>
              </Button>
            </div>
          </div>

          {searchOpenMobile && (
            <div className="relative pb-4 md:hidden">
              <div className="relative flex">
                <Input
                  type="search"
                  placeholder="Buscar productos"
                  className="w-full rounded-l-sm rounded-r-none border-2 border-border text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />

                <Button
                  type="button"
                  className="rounded-l-none rounded-r-sm border-2 border-l-0 border-border bg-background hover:bg-muted"
                >
                  <Search className="h-5 w-5 text-foreground" />
                </Button>

                {searchLoading && (
                  <div className="absolute left-0 right-0 top-full z-[10000] mt-1 rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
                    Buscando...
                  </div>
                )}

                {searchResults.length > 0 && (
                  <SearchResults
                    results={searchResults.slice(0, 5)}
                    onSelect={() => {
                      setSearchQuery("")
                      setSearchOpenMobile(false)
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="hidden bg-primary lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Link
              href="/category/novedades"
              className="px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-primary/80"
            >
              NOVEDADES
            </Link>

            {mainNavCategories.map((cat) => (
              <div key={cat.slug} className="group relative">
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  {cat.name.toUpperCase()}
                  {cat.slug !== "accesorios" && <ChevronDown className="h-4 w-4" />}
                </Link>

                {cat.slug !== "accesorios" && (
                  <div className="invisible absolute left-0 top-full z-[10020] opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[200px] border border-border bg-background py-2 text-foreground shadow-lg">
                      {(cat.slug === "extras" ? extrasSubcategories : subcategories).map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/category/${cat.slug}?tipo=${sub.slug}`}
                          className="block px-4 py-2 text-sm transition-colors hover:bg-muted"
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
              className="px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-primary/80"
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
