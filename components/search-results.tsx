"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { formatCurrency } from "@/lib/currency"

interface SearchResultsProps {
  results: Product[]
  onSelect: () => void
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
      {results.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
          onClick={onSelect}
        >
          <div className="relative w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <p className="text-sm font-semibold text-card-foreground">{formatCurrency(product.price)}</p>
        </Link>
      ))}
      {results.length > 0 && (
        <div className="p-3 border-t border-border bg-muted">
          <p className="text-sm text-center text-muted-foreground">
            Presiona Enter para ver todos los resultados
          </p>
        </div>
      )}
    </div>
  )
}
