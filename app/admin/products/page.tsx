import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
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
    <div className="container mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Administrar productos de la tienda
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          + Agregar producto
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-left p-3">Precio</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-t">

                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.slug}</td>
                <td className="p-3">{product.category_slug}</td>
                <td className="p-3">${product.price}</td>

                <td className="p-3">
                  {product.is_featured && "Destacado "}
                  {product.is_new && "Nuevo"}
                </td>

                <td className="p-3">
<div className="flex gap-3">
    <Link
      href={`/admin/products/${product.id}/edit`}
      className="text-blue-600"
    >
      Editar
    </Link>

    <DeleteProductButton
      productId={product.id}
      productName={product.name}
    />
  </div>
</td>
                

              </tr>
            ))}

            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No hay productos cargados
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

    </div>
  )
}