import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
}

export interface AuthState {
  user: User | null
  loading: boolean
}
