"use client"

import { CulinaryForm } from "@/components/culinary-form"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AddCulinaryPage() {
  return (
    <AdminLayout>
      {/* Align with destination edit layout */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Restaurant</h1>
          <p className="text-gray-600">Create a new restaurant entry</p>
        </div>

        <CulinaryForm />
      </div>
    </AdminLayout>
  )
}
