import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Auth types
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

