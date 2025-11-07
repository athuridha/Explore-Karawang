"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDestinations, deleteDestination } from "@/app/actions/destinations"
import { AdminLayout } from "@/components/admin/admin-layout"

interface Destination {
  id: string
  title: string
  description: string
  category: string
  location: string
  rating: number
  image: string
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = React.useState<Destination[]>([])
  const [loading, setLoading] = React.useState(true)
  const [deleting, setDeleting] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    const result = await getDestinations()
    if (result.success && result.data) {
      setDestinations(
        result.data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category,
          location: d.location,
          rating: d.rating,
          image: d.image,
        })),
      )
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return

    setDeleting(id)
    const result = await deleteDestination(id)
    if (result.success) {
      setDestinations(destinations.filter((d) => d.id !== id))
    } else {
      alert("Error deleting destination: " + result.error)
    }
    setDeleting(null)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "nature":
        return "bg-green-100 text-green-800 border-green-200"
      case "historical":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "recreational":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Destinations</h1>
          <p className="text-gray-600">
            Manage tourism destinations • {destinations.length} total
          </p>
        </div>
        <Link href="/admin/destinations/add">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" /> Add Destination
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-muted-foreground mt-4">Loading destinations...</p>
        </div>
      ) : destinations.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No destinations yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first destination
            </p>
            <Link href="/admin/destinations/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Add First Destination
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {destination.image && (
                    <div className="w-full md:w-56 h-56 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {destination.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          📍 {destination.location}
                        </p>
                      </div>
                      <Badge className={getCategoryColor(destination.category)} variant="outline">
                        {destination.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">Rating:</span>
                        <span className="text-yellow-600 font-semibold">
                          {destination.rating} ⭐
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/destinations/${destination.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2" size="sm">
                          <Edit className="h-4 w-4" /> Edit Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        size="sm"
                        onClick={() => handleDelete(destination.id)}
                        disabled={deleting === destination.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting === destination.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
