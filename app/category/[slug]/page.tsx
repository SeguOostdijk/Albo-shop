"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
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
import { ProductGrid } from "@/components/product-grid"
import { products, categories } from "@/lib/products"

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [gridCols, setGridCols] = useState<2 | 3>(3)

  const category = categories.find((c) => c.slug === slug)
  const categoryName = category?.name || "Todos los Productos"

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = slug === "all"
      ? products
      : products.filter((p) => p.categorySlug === slug)

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
        // relevance - featured first
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return result
  }, [slug, sortBy])

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const current = prev[groupId] || []
      if (checked) {
        return { ...prev, [groupId]: [...current, optionId] }
      }
      return { ...prev, [groupId]: current.filter((id) => id !== optionId) }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: categoryName },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} productos
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden bg-transparent">
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
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="newest">Mas nuevos</SelectItem>
            </SelectContent>
          </Select>

          {/* Grid Toggle - Desktop only */}
          <div className="hidden md:flex items-center border rounded-md">
            <Button
              variant={gridCols === 2 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setGridCols(2)}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Vista de 2 columnas</span>
            </Button>
            <Button
              variant={gridCols === 3 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setGridCols(3)}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Vista de 3 columnas</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Filters
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div
            className={`grid gap-4 md:gap-6 ${
              gridCols === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="secondary">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Siguiente</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { ProductCard } from "@/components/product-card"
