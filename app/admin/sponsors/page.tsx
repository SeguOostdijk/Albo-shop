import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import { SponsorsManager } from "@/components/admin/sponsors-manager"

export const revalidate = 0

export default async function AdminSponsorsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") redirect("/")

  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="flex justify-start max-w-6xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-700 text-sm font-semibold text-slate-600 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
      </div>

      <SponsorsManager mode="manage" />
    </div>
  )
}
