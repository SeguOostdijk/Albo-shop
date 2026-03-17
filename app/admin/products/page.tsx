import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Edit3, Trash2, Sparkles, Star, Eye, Tag } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export const revalidate = 0

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      category_slug,
      price,
      is_featured,
      is_new
    `)
    .order("name")

  if (error) {
    throw new Error(error.message)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6 gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            ← Volver al panel de administracion
          </Link>
          <Link href="/admin/products/new">
            <Button className="cursor-pointer hover:shadow-md">
              <Sparkles className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="rounded-md border bg-background p-0">
          <div className="flex items-center p-6">
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Productos ({products?.length || 0})
              </h2>
              <p className="text-sm text-muted-foreground">
                Gestiona tu catálogo de productos
              </p>
            </div>
            <div className="w-28" />
          </div>
          
          <div className="border-t">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left text-xs font-medium uppercase text-muted-foreground">
                      Producto
                    </th>
                    <th className="hidden h-12 px-4 text-right text-xs font-medium uppercase text-muted-foreground md:table-cell">
                      Categoría
                    </th>
                    <th className="hidden h-12 px-4 text-right text-xs font-medium uppercase text-muted-foreground md:table-cell">
                      Precio
                    </th>
                    <th className="h-12 w-32 shrink-0 px-4 text-right text-xs font-medium uppercase text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(!products || products.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="h-24 text-center text-muted-foreground">
                        No hay productos
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-4 px-4 text-right md:table-cell">
                          <span className="capitalize">{product.category_slug}</span>
                        </td>
                        <td className="hidden py-4 px-4 text-right md:table-cell">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {product.is_featured && (
                              <Badge variant="secondary">
                                <Star className="h-3 w-3 mr-1" />
                                Destacado
                              </Badge>
                            )}
                            {product.is_new && (
                              <Badge variant="default">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Nuevo
                              </Badge>
                            )}
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="ghost" size="sm" className="h-9 px-3 hover:bg-muted cursor-pointer">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DeleteProductButton productId={product.id} productName={product.name} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

