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
    <div className="space-y-6 p-1">
      <div className="space-y-2">
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-10 w-full rounded-xl bg-gradient-to-r from-destructive/10 to-destructive/5 backdrop-blur-sm border-destructive/30 hover:from-destructive/20 hover:shadow-lg hover:shadow-destructive/10 transition-all duration-300 font-medium text-destructive hover:text-destructive-foreground"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {filterOptions.map((group) => {
          const isOpen = openGroups.includes(group.id)

          return (
            <Collapsible
              key={group.id}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <div className="group rounded-2xl border border-border/50 bg-gradient-to-b from-white/60 via-white/20 to-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 overflow-hidden hover:scale-[1.02]">
                <CollapsibleTrigger className="group/header flex w-full items-center justify-between px-5 py-5 text-left font-semibold transition-all duration-400 hover:bg-white/40 hover:backdrop-blur-md hover:shadow-inner bg-gradient-to-r from-transparent via-white/50 to-transparent/50 relative overflow-hidden">
                  <span className="text-base font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent drop-shadow-sm">
                    {group.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg animate-pulse" />
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-500 ease-out",
                        isOpen && "rotate-180 -translate-y-0.5"
                      )}
                    />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden">
                  <div className="px-5 pb-5 space-y-2 backdrop-blur-sm">
                    {group.options.map((option) => {
                      const checked =
                        selectedFilters[group.id]?.includes(option.id) || false

                      return (
                        <label
                          key={option.id}
                          htmlFor={`${group.id}-${option.id}`}
                          className="group/label flex min-h-12 cursor-pointer items-start gap-4 rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 border border-border/30 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] hover:z-10"
                        >
                          <Checkbox
                            id={`${group.id}-${option.id}`}
                            className="mt-1 h-5 w-5 shrink-0 rounded-lg border-2 border-border hover:border-primary focus:ring-primary/50 focus:ring-2 shadow-md hover:shadow-primary/25 transition-all duration-200 group-hover/label:scale-110"
                            checked={checked}
                            onCheckedChange={(value) =>
                              onFilterChange(group.id, option.id, value === true)
                            }
                          />

                          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <span className="text-sm font-medium leading-6 text-foreground group-hover/label:text-primary/90 truncate group-hover/label:drop-shadow-sm">
                              {option.label}
                            </span>

                            {option.count !== undefined && (
                              <div className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-muted/60 to-muted/30 px-3 py-1 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-200 group-hover/label:bg-primary/20 group-hover/label:border-primary/50 group-hover/label:text-primary">
                                <span className="text-xs font-bold text-muted-foreground/90 group-hover/label:text-primary">
                                  ({option.count})
                                </span>
                              </div>
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
