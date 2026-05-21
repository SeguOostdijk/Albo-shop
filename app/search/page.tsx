import type { Metadata } from "next"
import { searchProductsFromDb } from "@/lib/products-db"
import { ProductCard } from "@/components/product-card"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  const query = (q ?? "").trim()
  return {
    title: query ? `Resultados para "${query}" | Albo Shop` : "Búsqueda | Albo Shop",
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams
  const query = q.trim()

  const products = query.length >= 2 ? await searchProductsFromDb(query) : []

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {query ? `Resultados para "${query}"` : "Búsqueda"}
        </h1>
        {query.length >= 2 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        )}
      </div>

      {query.length < 2 ? (
        <p className="text-muted-foreground">Ingresá al menos 2 caracteres para buscar.</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No se encontraron productos para &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
