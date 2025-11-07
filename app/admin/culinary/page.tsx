"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCulinaryItems, deleteCulinary } from "@/app/actions/culinary"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminCulinaryCardPreview } from "@/components/admin/admin-culinary-card-preview"

interface CulinaryItem {
  id: string
  title: string
  description: string
  category: string
  restaurant: string
  rating: number
  image: string
  location?: string
  priceRange?: string
  openingHours?: string
  specialties?: string[]
  googleMapsLink?: string
  facilities?: string[]
}

export default function CulinaryPage() {
  const [items, setItems] = React.useState<CulinaryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [deleting, setDeleting] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const result = await getCulinaryItems()
    if (result.success && result.data) {
      setItems(
        result.data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          category: d.category,
          restaurant: d.restaurant,
          rating: d.rating,
          image: d.image,
          location: d.location,
          priceRange: d.priceRange,
          openingHours: d.openingHours,
          specialties: d.specialties,
          googleMapsLink: d.googleMapsLink,
          facilities: d.facilities,
        })),
      )
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    setDeleting(id)
    const result = await deleteCulinary(id)
    if (result.success) {
      setItems(items.filter((i) => i.id !== id))
    } else {
      alert("Error deleting item: " + result.error)
    }
    setDeleting(null)
  }

  if (loading) {
    return <div className="text-center py-8">Loading culinary items...</div>
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Culinary Items</h1>
          <p className="text-gray-600">
            Manage restaurants & dishes • {items.length} total
          </p>
        </div>
        <Link href="/admin/culinary/add">
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="h-4 w-4" /> Add Culinary
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-muted-foreground mt-4">Loading culinary items...</p>
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No culinary items yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first restaurant or dish
            </p>
            <Link href="/admin/culinary/add">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Add First Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AdminCulinaryCardPreview
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              restaurant={item.restaurant}
              location={item.location || ""}
              category={item.category}
              rating={item.rating}
              priceRange={item.priceRange}
              openingHours={item.openingHours}
              specialties={item.specialties}
              googleMapsLink={item.googleMapsLink}
              facilities={item.facilities}
              onDelete={handleDelete}
              isDeleting={deleting === item.id}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
