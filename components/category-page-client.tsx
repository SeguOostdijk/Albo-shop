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
import { Filters, type FilterGroup, type FilterOption } from "@/components/filters"
import { FilterOption, FilterGroup } from "@/components/filters"

import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/type/products"

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
    const sizeCounts: Record<string, number> = {};
    const colorCounts: Record<string, number> = {};
    const priceCounts = {
      '0-30000': 0,
      '30000-60000': 0,
      '60000-90000': 0,
      '90000+': 0
    };
    const collectionCounts: Record<string, number> = {};

    products.forEach((p) => {
// Sizes
      (p.stockBySize || []).filter(s => s && typeof s.stock === 'number' && s.stock > 0 && s.size).forEach(s => {
        const sizeId = s.size!.toLowerCase();
        sizeCounts[sizeId] = (sizeCounts[sizeId] || 0) + 1;
      });

// Colors
      (p.variants || []).forEach(v => {
        if (v && v.color) {
          const colorId = v.color.toLowerCase();
          colorCounts[colorId] = (colorCounts[colorId] || 0) + 1;
        }
      });

      // Price
      const price = p.price;
      if (price <= 30000) priceCounts['0-30000']++;
      else if (price <= 60000) priceCounts['30000-60000']++;
      else if (price <= 90000) priceCounts['60000-90000']++;
      else priceCounts['90000+']++;

      // Collection
      p.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (['nueva-temporada', 'entrenamiento', 'retro'].includes(tagLower)) {
          collectionCounts[tagLower] = (collectionCounts[tagLower] || 0) + 1;
        }
      });
    });

    const groups: FilterGroup[] = [];

    if (Object.keys(sizeCounts).length > 0) {
      groups.push({
        id: 'size',
        name: 'Talle',
        options: Object.entries(sizeCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([id, count]) => ({
            id,
            label: id.toUpperCase(),
            count
          }))
      });
    }

    if (Object.keys(colorCounts).length > 0) {
      groups.push({
        id: 'color',
        name: 'Color',
        options: Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([id, count]) => ({
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            count
          }))
      });
    }

    groups.push({
      id: 'price',
      name: 'Precio',
      options: [
        { id: '0-30000', label: 'Hasta $30.000', count: priceCounts['0-30000'] },
        { id: '30000-60000', label: '$30.000 - $60.000', count: priceCounts['30000-60000'] },
        { id: '60000-90000', label: '$60.000 - $90.000', count: priceCounts['60000-90000'] },
        { id: '90000+', label: 'Mas de $90.000', count: priceCounts['90000+'] }
      ].filter(o => o.count > 0)
    });

    if (Object.keys(collectionCounts).length > 0) {
      groups.push({
        id: 'collection',
        name: 'Coleccion',
        options: Object.entries(collectionCounts)
          .map(([id, count]) => ({
            id,
            label: id.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            count
          }))
      });
    }

    return groups;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products

    // Size filter
    if (selectedFilters.size && selectedFilters.size.length > 0) {
      result = result.filter((p) =>
        (p.stockBySize || []).some((s) => 
          s && s.size && selectedFilters.size.includes(s.size.toLowerCase()) && typeof s.stock === 'number' && s.stock > 0
        )
      )
    }

// Color filter
    if (selectedFilters.color && selectedFilters.color.length > 0) {
      result = result.filter((p) =>
        (p.variants || []).some((v) => 
          v && v.color && selectedFilters.color.includes(v.color.toLowerCase())
        )
      )
    }

    // Price filter
    if (selectedFilters.price && selectedFilters.price.length > 0) {
      result = result.filter((p) => {
        const price = p.price
        if (selectedFilters.price.includes('0-30000') && price <= 30000) return true
        if (selectedFilters.price.includes('30000-60000') && price > 30000 && price <= 60000) return true
        if (selectedFilters.price.includes('60000-90000') && price > 60000 && price <= 90000) return true
        if (selectedFilters.price.includes('90000+') && price > 90000) return true
        return false
      })
    }

    // Collection filter
    if (selectedFilters.collection && selectedFilters.collection.length > 0) {
      result = result.filter((p) =>
        p.tags.some((tag) => 
          selectedFilters.collection.includes(tag.toLowerCase())
        )
      )
    }

    // Tipo from URL
    if (tipo) {
      result = result.filter((p) =>
        p.tags.some((tag) => tag.toLowerCase() === tipo.toLowerCase())
      )
    }

    // Sort
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
  }, [products, selectedFilters, tipo, sortBy])

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    const current = selectedFilters[groupId] || []
    const newFilters = checked
      ? [...current, optionId]
      : current.filter((id) => id !== optionId)

    setSelectedFilters({ ...selectedFilters, [groupId]: newFilters })
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: categoryName }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-1">{filteredProducts.length} productos</p>
        </div>

        <div className="flex items-center gap-3">
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
                  filterOptions={filterOptions}
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
              <SelectItem value="relevance" className="cursor-pointer hover:bg-accent">Relevancia</SelectItem>
              <SelectItem value="price-asc" className="cursor-pointer hover:bg-accent">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc" className="cursor-pointer hover:bg-accent">Precio: mayor a menor</SelectItem>
              <SelectItem value="newest" className="cursor-pointer hover:bg-accent">Mas nuevos</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex items-center border rounded-md">
              <Button
              variant={gridCols === 2 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => setGridCols(2)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={gridCols === 3 ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => setGridCols(3)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Filters
            filterOptions={filterOptions}
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