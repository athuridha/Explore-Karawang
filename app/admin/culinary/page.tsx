"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCulinaryItems, deleteCulinary } from "@/app/actions/culinary"
import { AdminLayout } from "@/components/admin/admin-layout"

interface CulinaryItem {
  id: string
  title: string
  description: string
  category: string
  restaurant: string
  rating: number
  image: string
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "traditional":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "seafood":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "snack":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "modern":
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
        <div className="grid gap-6">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {item.image && (
                    <div className="w-full md:w-56 h-56 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          🏪 {item.restaurant}
                        </p>
                      </div>
                      <Badge className={getCategoryColor(item.category)} variant="outline">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">Rating:</span>
                        <span className="text-yellow-600 font-semibold">
                          {item.rating} ⭐
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/culinary/${item.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2" size="sm">
                          <Edit className="h-4 w-4" /> Edit Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting === item.id ? "Deleting..." : "Delete"}
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
