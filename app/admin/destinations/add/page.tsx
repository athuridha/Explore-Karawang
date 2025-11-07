"use client"

import { DestinationForm } from "@/components/destination-form"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AddDestinationPage() {
  return (
    <AdminLayout>
      {/* Match Edit Destination layout width and centering */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Destination</h1>
          <p className="text-gray-600">Create a new tourism destination</p>
        </div>

        <DestinationForm />
      </div>
    </AdminLayout>
  )
}
