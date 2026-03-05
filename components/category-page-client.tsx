"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Filters } from "@/components/filters"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types/products"

// Ajustá este type si tu categoría tiene otra forma
type Category = { slug: string; name: string }

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest"

export function CategoryPageClient({
  slug,
  products,
  categories,
}: {
  slug: string
  products: Product[]
  categories: Category[]
}) {
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") as string | null

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [gridCols, setGridCols] = useState<2 | 3>(3)

  const category = categories.find((c) => c.slug === slug)
  const categoryName = category?.name || "Todos los Productos"

  const filteredProducts = useMemo(() => {
    let result = products

    // Filter by subcategory (tipo)
    if (tipo) {
      result = result.filter((p) =>
        p.tags.some((tag) => tag.toLowerCase() === tipo.toLowerCase())
      )
    }

    // Apply selected filters
    Object.entries(selectedFilters).forEach(([groupId, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        result = result.filter((p) => {
          // Size filter
          if (groupId === "size") {
            return p.variants.some((v) =>
              v.sizes.some((s) => selectedOptions.includes(s.toLowerCase()))
            )
          }
          // Color filter
          if (groupId === "color") {
            return p.variants.some((v) =>
              selectedOptions.includes(v.color.toLowerCase())
            )
          }
          // Price filter
          if (groupId === "price") {
            return selectedOptions.some((priceRange) => {
              const [min, max] = priceRange.split("-").map((v) => (v === "+" ? Infinity : Number(v)))
              if (max === Infinity) {
                return p.price >= min
              }
              return p.price >= min && p.price <= max
            })
          }
          // Collection filter
          if (groupId === "collection") {
            return p.tags.some((tag) =>
              selectedOptions.includes(tag.toLowerCase())
            )
          }
          return true
        })
      }
    })

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "newest":
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return result
  }, [products, tipo, sortBy, selectedFilters])

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    const current = selectedFilters[groupId] || []
    const newFilters = checked ? [...current, optionId] : current.filter((id) => id !== optionId)
    setSelectedFilters({ ...selectedFilters, [groupId]: newFilters })
  }

  const clearFilters = () => setSelectedFilters({})

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: categoryName }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} productos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden bg-transparent cursor-pointer">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Filters
                  products={products}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance" className="cursor-pointer">Relevancia</SelectItem>
              <SelectItem value="price-asc" className="cursor-pointer">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc" className="cursor-pointer">Precio: mayor a menor</SelectItem>
              <SelectItem value="newest" className="cursor-pointer">Mas nuevos</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex items-center border rounded-md">
            <Button
              variant={gridCols === 2 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none cursor-pointer"
              onClick={() => setGridCols(2)}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Vista de 2 columnas</span>
            </Button>
            <Button
              variant={gridCols === 3 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none cursor-pointer"
              onClick={() => setGridCols(3)}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Vista de 3 columnas</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Filters
            products={products}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </aside>

        <div className="flex-1">
          <div
            className={`grid gap-4 md:gap-6 ${
              gridCols === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}