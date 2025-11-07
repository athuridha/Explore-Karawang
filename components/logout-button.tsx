"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut } from "lucide-react"

export function AdminLogout() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout().finally(() => router.push("/admin/login"))
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
