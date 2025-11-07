"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { id: string; email: string; username: string; role: string } | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null)
  const isAuthenticated = !!user

  async function fetchMe() {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      if (res.ok) {
        const json = await res.json()
        if (json.authenticated) setUser(json.user)
        else setUser(null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchMe()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) return false
      const json = await res.json()
      setUser(json.user)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
