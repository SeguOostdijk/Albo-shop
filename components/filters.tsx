"use client"

import { useEffect, useState } from "react"
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

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterGroup {
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

export function Filters({
  filterOptions,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}: FiltersProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([])

  useEffect(() => {
    setOpenGroups(filterOptions.map((group) => group.id))
  }, [filterOptions])

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
      <div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-sm"
          >
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filterOptions.map((group) => {
          const isOpen = openGroups.includes(group.id)

          return (
            <Collapsible
              key={group.id}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <div className="rounded-lg border border-border bg-background">
                <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-3 text-left font-medium transition-colors hover:bg-muted/50 sm:px-4">
                  <span className="text-sm sm:text-base">{group.name}</span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="space-y-1 px-3 pb-3 sm:px-4 sm:pb-4">
                    {group.options.map((option) => {
                      const checked =
                        selectedFilters[group.id]?.includes(option.id) || false

                      return (
                        <label
                          key={option.id}
                          htmlFor={`${group.id}-${option.id}`}
                          className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`${group.id}-${option.id}`}
                            className="mt-0.5 shrink-0"
                            checked={checked}
                            onCheckedChange={(value) =>
                              onFilterChange(group.id, option.id, value === true)
                            }
                          />

                          <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                            <span className="text-sm leading-5 text-foreground">
                              {option.label}
                            </span>

                            {option.count !== undefined && (
                              <span className="shrink-0 text-sm text-muted-foreground">
                                ({option.count})
                              </span>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}