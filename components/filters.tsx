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

const filterGroups: FilterGroup[] = [
  {
    id: "size",
    name: "Talle",
    options: [
      { id: "xs", label: "XS", count: 5 },
      { id: "s", label: "S", count: 12 },
      { id: "m", label: "M", count: 15 },
      { id: "l", label: "L", count: 14 },
      { id: "xl", label: "XL", count: 10 },
      { id: "xxl", label: "XXL", count: 6 },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { id: "azul", label: "Azul", count: 20 },
      { id: "blanco", label: "Blanco", count: 15 },
      { id: "celeste", label: "Celeste", count: 8 },
      { id: "gris", label: "Gris", count: 5 },
    ],
  },
  {
    id: "price",
    name: "Precio",
    options: [
      { id: "0-30000", label: "Hasta $30.000" },
      { id: "30000-60000", label: "$30.000 - $60.000" },
      { id: "60000-90000", label: "$60.000 - $90.000" },
      { id: "90000+", label: "Mas de $90.000" },
    ],
  },
  {
    id: "type",
    name: "Tipo de Producto",
    options: [
      { id: "camisetas", label: "Camisetas", count: 8 },
      { id: "shorts", label: "Shorts", count: 4 },
      { id: "buzos", label: "Buzos", count: 3 },
      { id: "camperas", label: "Camperas", count: 2 },
      { id: "accesorios", label: "Accesorios", count: 6 },
    ],
  },
  {
    id: "collection",
    name: "Coleccion",
    options: [
      { id: "nueva-temporada", label: "Nueva Temporada", count: 10 },
      { id: "entrenamiento", label: "Entrenamiento", count: 5 },
      { id: "retro", label: "Retro", count: 2 },
    ],
  },
]

interface FiltersProps {
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, optionId: string, checked: boolean) => void
  onClearFilters: () => void
}

export function Filters({ selectedFilters, onFilterChange, onClearFilters }: FiltersProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(["size", "color"])

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
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
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
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-secondary transition-colors">
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
