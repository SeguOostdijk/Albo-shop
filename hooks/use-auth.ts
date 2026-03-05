"use client"

import { create } from "zustand"
import { supabase } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  dni: string | null
  created_at: string
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        set({ session, user: session.user })
        
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        
        if (profile) {
          set({ profile })
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error)
    } finally {
      set({ initialized: true })
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        // Create profile
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        })

        set({ user: data.user })
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      if (data.session) {
        set({ session: data.session, user: data.user })
        
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user!.id)
          .single()
        
        if (profile) {
          set({ profile })
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    set({ loading: true })
    try {
      await supabase.auth.signOut()
      set({ user: null, session: null, profile: null })
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (data: Partial<Profile>) => {
    const { user } = get()
    if (!user) return { error: new Error("Not authenticated") }

    set({ loading: true })
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id)

      if (error) {
        return { error }
      }

      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
      }))

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      set({ loading: false })
    }
  },
}))

