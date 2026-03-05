"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)
  const initialized = useAuthStore((state) => state.initialized)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    initialize()
    setMounted(true)
  }, [initialize])

  if (!mounted || !initialized) {
    return null
  }

  return <>{children}</>
}

