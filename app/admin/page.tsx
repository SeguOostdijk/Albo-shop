import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Sparkles, Edit3, ShoppingBag } from "lucide-react"
import { SponsorsManager } from "@/components/admin/sponsors-manager"

export const revalidate = 0

function formatPrice(value: number | null | undefined) {
  if (value == null) return "-"
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value)
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

function getFullName(firstName: string | null | undefined, lastName: string | null | undefined) {
  return [firstName, lastName].filter(Boolean).join(" ") || "-"
}

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/")
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      first_name,
      last_name,
      email,
      member_number,
      total,
      status,
      payment_method,
      shipping_method,
      shipping_cost,
      created_at,
      order_items (
        id,
        product_name,
        price,
        member_price,
        quantity,
        color,
        size,
        product_image
      )
    `)
    .order("created_at", { ascending: false })
    .limit(15)

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 lg:py-20 pb-12 sm:pb-16 lg:pb-20">
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
          <Package className="h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Panel de administrador
          </h1>
        </div>
      </div>

      <Card className="border-none bg-gradient-to-br from-emerald-50/90 via-white/50 to-green-50/80 backdrop-blur-xl shadow-2xl shadow-emerald-200/50 border border-emerald-200/30 mb-16 sm:mb-28 hover:shadow-emerald-300/60 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto group">
        <CardHeader className="text-center pb-2 sm:pb-4 pt-6 sm:pt-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-700">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-white shadow-lg drop-shadow-md" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent drop-shadow-lg mb-1 sm:mb-2">
            PRODUCTOS
          </CardTitle>
          <p className="text-base sm:text-lg text-emerald-700 font-medium tracking-wide opacity-90">
            Gestiona tu catálogo completo
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 lg:p-8 items-center justify-center w-full">
            <Link href="/admin/products/new" className="group/button cursor-pointer w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-72 lg:w-80 h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-emerald-500/95 to-green-600/95 hover:from-emerald-600/100 hover:to-green-700/100 shadow-xl hover:shadow-emerald-500/25 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.02] text-base sm:text-lg lg:text-xl font-black rounded-2xl border-3 border-emerald-400/50 backdrop-blur-sm transition-all duration-500 cursor-pointer"
              >
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-5 h-5 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
                    <Sparkles className="h-3 w-3 text-white drop-shadow-sm" />
                  </div>
                  <span className="hidden xs:inline">+ Nuevo Producto</span>
                  <span className="inline xs:hidden">+ Nuevo</span>
                </span>
              </Button>
            </Link>

            <Link href="/admin/products" className="group/button cursor-pointer w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-72 lg:w-80 h-12 sm:h-14 lg:h-16 border-3 border-emerald-500/70 shadow-xl hover:shadow-emerald-400/50 hover:shadow-2xl hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-600/20 text-base sm:text-lg lg:text-xl font-black rounded-2xl border-opacity-80 backdrop-blur-sm hover:border-emerald-600/90 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-500 cursor-pointer"
              >
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-md flex items-center justify-center backdrop-blur-sm">
                    <Edit3 className="h-3 w-3 text-emerald-800 drop-shadow-sm" />
                  </div>
                  <span className="hidden xs:inline">Editar Productos</span>
                  <span className="inline xs:hidden">Editar</span>
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-full sm:max-w-3xl lg:max-w-6xl mx-auto mb-16 sm:mb-28 border border-slate-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-black">
                Historial de pedidos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 15 pedidos realizados
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {ordersError ? (
            <p className="text-sm text-red-500">
              Error al cargar los pedidos: {ordersError.message}
            </p>
          ) : !orders || orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay pedidos registrados.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <details
                  key={order.id}
                  className="rounded-2xl border bg-white shadow-sm overflow-hidden"
                >
                  <summary className="cursor-pointer list-none p-4 sm:p-5 hover:bg-slate-50 transition">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Pedido #{order.id}
                        </p>
                        <h3 className="text-lg font-bold">
                          {getFullName(order.first_name, order.last_name)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.email ?? "-"}
                        </p>
                      </div>

                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fecha</p>
                          <p className="font-medium">{formatDate(order.created_at)}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Estado</p>
                          <p className="font-medium">{order.status ?? "-"}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </div>
                  </summary>

                  <div className="border-t bg-slate-50/60 p-4 sm:p-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-muted-foreground mb-1">Método de pago</p>
                        <p className="font-medium">{order.payment_method ?? "-"}</p>
                      </div>

                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-muted-foreground mb-1">Envío</p>
                        <p className="font-medium">{order.shipping_method ?? "-"}</p>
                      </div>

                      <div className="rounded-xl border bg-white p-4">
                        <p className="text-muted-foreground mb-1">Costo de envío</p>
                        <p className="font-medium">{formatPrice(order.shipping_cost)}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold mb-3">Productos del pedido</h4>

                      {!order.order_items || order.order_items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Este pedido no tiene items cargados.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border bg-white">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-100">
                              <tr className="text-left">
                                <th className="px-4 py-3 font-bold">Producto</th>
                                <th className="px-4 py-3 font-bold">Color</th>
                                <th className="px-4 py-3 font-bold">Talle</th>
                                <th className="px-4 py-3 font-bold">Cantidad</th>
                                <th className="px-4 py-3 font-bold">Precio</th>
                                <th className="px-4 py-3 font-bold">Precio socio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items.map((item) => (
                                <tr key={item.id} className="border-t">
                                  <td className="px-4 py-3 font-medium">
                                    {item.product_name ?? "-"}
                                  </td>
                                  <td className="px-4 py-3">{item.color ?? "-"}</td>
                                  <td className="px-4 py-3">{item.size ?? "-"}</td>
                                  <td className="px-4 py-3">{item.quantity ?? "-"}</td>
                                  <td className="px-4 py-3">{formatPrice(item.price)}</td>
                                  <td className="px-4 py-3">
                                    {formatPrice(item.member_price)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SponsorsManager />
    </div>
  )
}