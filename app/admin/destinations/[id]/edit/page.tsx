"use client"

import { Suspense } from "react"
import { DestinationForm } from "@/components/destination-form"
import { AdminLayout } from "@/components/admin/admin-layout"

interface PageProps {
  params: {
    id: string
  }
}

export default function EditDestinationPage({ params }: PageProps) {
  return (
    <AdminLayout>
      {/* Limit content width on desktop as per design; center within main */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Destination</h1>
          <p className="text-gray-600">Update destination information</p>
        </div>

        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground mt-4">Loading form...</p>
          </div>
        }>
          <DestinationForm destinationId={params.id} />
        </Suspense>
      </div>
    </AdminLayout>
  )
}
