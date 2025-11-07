"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDestinations, deleteDestination } from "@/app/actions/destinations"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDestinationCardPreview } from "@/components/admin/admin-destination-card-preview"

interface Destination {
  id: string
  title: string
  description: string
  category: string
  location: string
  rating: number
  image: string
  bestTimeToVisit?: string
  entranceFee?: string
  googleMapsLink?: string
  facilities?: string[]
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
          bestTimeToVisit: d.bestTimeToVisit,
          entranceFee: d.entranceFee,
          googleMapsLink: d.googleMapsLink,
          facilities: d.facilities,
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

  if (loading) {
    return <div className="text-center py-8">Loading destinations...</div>
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <AdminDestinationCardPreview
              key={destination.id}
              id={destination.id}
              title={destination.title}
              description={destination.description}
              image={destination.image}
              location={destination.location}
              category={destination.category}
              rating={destination.rating}
              bestTimeToVisit={destination.bestTimeToVisit}
              entranceFee={destination.entranceFee}
              googleMapsLink={destination.googleMapsLink}
              facilities={destination.facilities}
              onDelete={handleDelete}
              isDeleting={deleting === destination.id}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
