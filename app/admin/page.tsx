import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"


export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single()

  console.log("USER ADMIN PAGE:", user)
  if (error || !profile || profile.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Panel de editor</h1>
      <p className="mt-2 text-muted-foreground">
        Bienvenido. Desde acá vas a poder administrar productos.
      </p>

      <div className="mt-6 rounded-lg border p-4">
        <p>
          <span className="font-medium">Usuario:</span> {profile.email}
        </p>
        <p>
          <span className="font-medium">Rol:</span> {profile.role}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/admin/products"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Administrar productos
        </Link>

      </div>
    </div>
  )
}