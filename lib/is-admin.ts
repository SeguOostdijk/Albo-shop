import { createClient } from "@/lib/supabase/client"

export async function isAdmin() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  return data?.role === "admin"
}