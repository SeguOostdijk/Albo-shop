"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/type/products"
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Filters } from "@/components/filters"

type Category = {
  slug: string
  name: string
}

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  name: string
  options: FilterOption[]
}

interface CategoryPageClientProps {
  slug: string
  products: Product[]
  categories: Category[]
}

export function CategoryPageClient({
  slug,
  products,
  categories,
}: CategoryPageClientProps) {
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") as string | null

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [gridCols, setGridCols] = useState<2 | 3>(3)

  const category = categories.find((c) => c.slug === slug)
  const categoryName = category?.name || "Todos los Productos"

  const filterOptions = useMemo<FilterGroup[]>(() => {
    const sizeCounts: Record<string, number> = {}
    const colorCounts: Record<string, number> = {}
    const priceCounts = {
      "0-30000": 0,
      "30000-60000": 0,
      "60000-90000": 0,
      "90000+": 0,
    }
    const collectionCounts: Record<string, number> = {}

    products.forEach((p) => {
      ;(p.stockBySize || [])
        .filter((s) => s && typeof s.stock === "number" && s.stock > 0 && s.size)
        .forEach((s) => {
          const sizeId = s.size!.toLowerCase()
          sizeCounts[sizeId] = (sizeCounts[sizeId] || 0) + 1
        })

      ;(p.variants || []).forEach((v) => {
        if (v && v.color) {
          const colorId = v.color.toLowerCase()
          colorCounts[colorId] = (colorCounts[colorId] || 0) + 1
        }
      })

      const price = p.price
      if (price <= 30000) priceCounts["0-30000"]++
      else if (price <= 60000) priceCounts["30000-60000"]++
      else if (price <= 90000) priceCounts["60000-90000"]++
      else priceCounts["90000+"]++

      p.tags.forEach((tag) => {
        const tagLower = tag.toLowerCase()
        if (["nueva-temporada", "entrenamiento", "retro"].includes(tagLower)) {
          collectionCounts[tagLower] = (collectionCounts[tagLower] || 0) + 1
        }
      })
    })

    const groups: FilterGroup[] = []

    if (Object.keys(sizeCounts).length > 0) {
      groups.push({
        id: "size",
        name: "Talle",
        options: Object.entries(sizeCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([id, count]) => ({
            id,
            label: id.toUpperCase(),
            count,
          })),
      })
    }

    if (Object.keys(colorCounts).length > 0) {
      groups.push({
        id: "color",
        name: "Color",
        options: Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([id, count]) => ({
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            count,
          })),
      })
    }

    groups.push({
      id: "price",
      name: "Precio",
      options: [
        { id: "0-30000", label: "Hasta $30.000", count: priceCounts["0-30000"] },
        { id: "30000-60000", label: "$30.000 - $60.000", count: priceCounts["30000-60000"] },
        { id: "60000-90000", label: "$60.000 - $90.000", count: priceCounts["60000-90000"] },
        { id: "90000+", label: "Más de $90.000", count: priceCounts["90000+"] },
      ].filter((o) => (o.count ?? 0) > 0),
    })

    if (Object.keys(collectionCounts).length > 0) {
      groups.push({
        id: "collection",
        name: "Colección",
        options: Object.entries(collectionCounts).map(([id, count]) => ({
          id,
          label: id
            .replace("-", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          count,
        })),
      })
    }

    return groups
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = products

    if (selectedFilters.size && selectedFilters.size.length > 0) {
      result = result.filter((p) =>
        (p.stockBySize || []).some(
          (s) =>
            s &&
            s.size &&
            selectedFilters.size.includes(s.size.toLowerCase()) &&
            typeof s.stock === "number" &&
            s.stock > 0
        )
      )
    }

    if (selectedFilters.color && selectedFilters.color.length > 0) {
      result = result.filter((p) =>
        (p.variants || []).some(
          (v) => v && v.color && selectedFilters.color.includes(v.color.toLowerCase())
        )
      )
    }

    if (selectedFilters.price && selectedFilters.price.length > 0) {
      result = result.filter((p) => {
        const price = p.price
        if (selectedFilters.price.includes("0-30000") && price <= 30000) return true
        if (selectedFilters.price.includes("30000-60000") && price > 30000 && price <= 60000)
          return true
        if (selectedFilters.price.includes("60000-90000") && price > 60000 && price <= 90000)
          return true
        if (selectedFilters.price.includes("90000+") && price > 90000) return true
        return false
      })
    }

    if (selectedFilters.collection && selectedFilters.collection.length > 0) {
      result = result.filter((p) =>
        p.tags.some((tag) => selectedFilters.collection.includes(tag.toLowerCase()))
      )
    }

    if (tipo) {
      result = result.filter((p) =>
        p.tags.some((tag) => tag.toLowerCase() === tipo.toLowerCase())
      )
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "newest":
        result = [...result].sort((a, b) => Number(b.isNew) - Number(a.isNew))
        break
      default:
        result = [...result].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    }

    return result
  }, [products, selectedFilters, tipo, sortBy])

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    const current = selectedFilters[groupId] || []
    const newFilters = checked
      ? [...current, optionId]
      : current.filter((id) => id !== optionId)

    setSelectedFilters((prev) => ({
      ...prev,
      [groupId]: newFilters,
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  return (
    <div className="container mx-auto px-4 py-5 sm:py-6">
      <Breadcrumbs items={[{ label: categoryName }]} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{categoryName}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {filteredProducts.length} productos
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent sm:w-auto lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[88vw] max-w-[340px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription className="sr-only">
                  Filtrá los productos por talle, color, precio y colección.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6">
                <Filters
                  filterOptions={filterOptions}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full min-w-0 cursor-pointer sm:w-[220px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance" className="cursor-pointer">
                Relevancia
              </SelectItem>
              <SelectItem value="price-asc" className="cursor-pointer">
                Precio: menor a mayor
              </SelectItem>
              <SelectItem value="price-desc" className="cursor-pointer">
                Precio: mayor a menor
              </SelectItem>
              <SelectItem value="newest" className="cursor-pointer">
                Más nuevos
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden items-center rounded-md border md:flex">
            <Button
              type="button"
              variant={gridCols === 2 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => setGridCols(2)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={gridCols === 3 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => setGridCols(3)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Filters
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </aside>

        <div className="min-w-0 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-border bg-background px-4 py-10 text-center">
              <p className="text-base font-medium">No se encontraron productos</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Probá cambiando los filtros o el ordenamiento.
              </p>
            </div>
          ) : (
            <div
              className={[
                "grid items-stretch gap-3 sm:gap-4 lg:gap-6",
              gridCols === 2
                  ? "grid-cols-2"
                  : "grid-cols-3",
              ].join(" ")}
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="min-w-0 w-full max-w-xs mx-auto xl:max-w-sm">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}