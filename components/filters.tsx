"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types/products"

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

function getFilterGroups(products: Product[]): FilterGroup[] {
  // Count sizes
  const sizeCounts: Record<string, number> = {}
  // Count colors
  const colorCounts: Record<string, number> = {}
  // Count price ranges
  const priceRanges = [
    { id: "0-30000", label: "Hasta $30.000", min: 0, max: 30000 },
    { id: "30000-60000", label: "$30.000 - $60.000", min: 30000, max: 60000 },
    { id: "60000-90000", label: "$60.000 - $90.000", min: 60000, max: 90000 },
    { id: "90000+", label: "Mas de $90.000", min: 90000, max: Infinity },
  ]
  const priceCounts: Record<string, number> = {}
  // Count collections
  const collectionCounts: Record<string, number> = {}

  products.forEach((product) => {
    // Count sizes from variants
    product.variants.forEach((variant) => {
      variant.sizes.forEach((size) => {
        const s = size.toLowerCase()
        sizeCounts[s] = (sizeCounts[s] || 0) + 1
      })
    })

    // Count colors from variants
    product.variants.forEach((variant) => {
      const c = variant.color.toLowerCase()
      colorCounts[c] = (colorCounts[c] || 0) + 1
    })

    // Count price ranges
    priceRanges.forEach((range) => {
      if (product.price >= range.min && product.price <= range.max) {
        priceCounts[range.id] = (priceCounts[range.id] || 0) + 1
      }
    })

    // Count collections from tags
    product.tags.forEach((tag) => {
      const t = tag.toLowerCase()
      if (t.includes("retro") || t.includes("entrenamiento") || t.includes("nueva")) {
        collectionCounts[t] = (collectionCounts[t] || 0) + 1
      }
    })
  })

  return [
    {
      id: "size",
      name: "Talle",
      options: [
        { id: "xs", label: "XS", count: sizeCounts["xs"] || 0 },
        { id: "s", label: "S", count: sizeCounts["s"] || 0 },
        { id: "m", label: "M", count: sizeCounts["m"] || 0 },
        { id: "l", label: "L", count: sizeCounts["l"] || 0 },
        { id: "xl", label: "XL", count: sizeCounts["xl"] || 0 },
        { id: "xxl", label: "XXL", count: sizeCounts["xxl"] || 0 },
      ].filter(o => o.count > 0),
    },
    {
      id: "color",
      name: "Color",
      options: Object.entries(colorCounts).map(([color, count]) => ({
        id: color,
        label: color.charAt(0).toUpperCase() + color.slice(1),
        count,
      })).filter(o => o.count > 0),
    },
    {
      id: "price",
      name: "Precio",
      options: priceRanges
        .map((range) => ({
          id: range.id,
          label: range.label,
          count: priceCounts[range.id] || 0,
        }))
        .filter(o => o.count > 0),
    },
    {
      id: "collection",
      name: "Coleccion",
      options: Object.entries(collectionCounts).map(([collection, count]) => ({
        id: collection,
        label: collection.charAt(0).toUpperCase() + collection.slice(1),
        count,
      })).filter(o => o.count > 0),
    },
  ]
}

interface FiltersProps {
  products: Product[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, optionId: string, checked: boolean) => void
  onClearFilters: () => void
}

export function Filters({ products, selectedFilters, onFilterChange, onClearFilters }: FiltersProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(["size", "color"])
  
  const filterGroups = getFilterGroups(products)

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr.length > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="cursor-pointer">
            Limpiar
          </Button>
        )}
      </div>

      {filterGroups.map((group) => (
        <Collapsible
          key={group.id}
          open={openGroups.includes(group.id)}
          onOpenChange={() => toggleGroup(group.id)}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-secondary transition-colors cursor-pointer">
            {group.name}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                openGroups.includes(group.id) && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-4">
            {group.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${group.id}-${option.id}`}
                  checked={selectedFilters[group.id]?.includes(option.id) || false}
                  onCheckedChange={(checked) =>
                    onFilterChange(group.id, option.id, checked as boolean)
                  }
                  className="cursor-pointer"
                />
                <Label
                  htmlFor={`${group.id}-${option.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span className="text-muted-foreground ml-1">({option.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
