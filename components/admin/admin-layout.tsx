"use client"

import { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProtectedRoute } from "@/components/protected-route"

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content - with left margin for desktop sidebar */}
        <div className="md:ml-64 min-h-screen flex flex-col">
          {/* Header */}
          <AdminHeader />

          {/* Content - padding top untuk mobile burger button */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 md:pt-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
