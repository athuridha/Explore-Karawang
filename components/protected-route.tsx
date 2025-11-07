"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
