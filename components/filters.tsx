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



interface FiltersProps {
  filterOptions: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, optionId: string, checked: boolean) => void
  onClearFilters: () => void
}

export function Filters({ filterOptions, selectedFilters, onFilterChange, onClearFilters }: FiltersProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([])

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

{filterOptions.map((group) => (
        <Collapsible
          key={group.id}
          open={openGroups.includes(group.id)}
          onOpenChange={() => toggleGroup(group.id)}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-secondary hover:cursor-pointer transition-colors">
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
                <div key={option.id} className="flex items-center space-x-2 hover:cursor-pointer">
                  <Checkbox
                    id={`${group.id}-${option.id}`}
                    className="cursor-pointer data-[state=checked]:cursor-pointer"
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
