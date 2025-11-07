"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

// Placeholder page for future local specialty dishes separate from restaurant listings
export default function SpecialtiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-6 md:px-8 lg:px-12 py-10">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Local Specialty Dishes</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          This section will showcase iconic and traditional dishes unique to Karawang. You can later manage
          them separately from restaurant entries.
        </p>

        <div className="rounded-lg border bg-white p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-600 mb-4">No specialty dishes have been added yet.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/culinary/add">Add a Restaurant First</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
