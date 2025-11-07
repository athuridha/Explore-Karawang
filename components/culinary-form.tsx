"use client"

import Link from "next/link"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addCulinary, updateCulinary, getCulinaryById } from "@/app/actions/culinary"

interface CulinaryFormProps {
  culinaryId?: string
}

interface FormData {
  title: string
  description: string
  image: string
  restaurant: string
  location: string
  priceRange: string
  openingHours: string
  specialties: string[]
  rating: number
  category: "traditional" | "seafood" | "snack" | "modern"
  googleMapsLink: string
}

export function CulinaryForm({ culinaryId }: CulinaryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(!!culinaryId)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    description: "",
    image: "",
    restaurant: "",
    location: "",
    priceRange: "",
    openingHours: "",
    specialties: [],
    rating: 4.5,
    category: "traditional",
    googleMapsLink: "",
  })

  const [specialtiesInput, setSpecialtiesInput] = React.useState("")

  React.useEffect(() => {
    if (culinaryId) {
      fetchCulinary()
    }
  }, [culinaryId])

  const fetchCulinary = async () => {
    if (!culinaryId) return

    setFetching(true)
    const result = await getCulinaryById(culinaryId)
    if (result.success && result.data) {
      const d = result.data
      setFormData({
        title: d.title,
        description: d.description,
        image: d.image || "",
        restaurant: d.restaurant,
        location: d.location,
        priceRange: d.price_range || "",
        openingHours: d.opening_hours || "",
        specialties: d.specialties || [],
        rating: d.rating,
        category: d.category,
        googleMapsLink: d.google_maps_link || "",
      })
      setSpecialtiesInput((d.specialties || []).join(", "))
    } else {
      setError("Failed to load culinary item")
    }
    setFetching(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseFloat(value) : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as "traditional" | "seafood" | "snack" | "modern",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const specialties = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)

    const submitData = {
      ...formData,
      specialties,
    }

    try {
      let result
      if (culinaryId) {
        result = await updateCulinary(culinaryId, submitData)
      } else {
        result = await addCulinary(submitData)
      }

      if (result.success) {
        router.push("/admin/culinary")
      } else {
        setError(result.error || "Failed to save culinary item")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center py-8">Loading culinary item...</div>
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Form Card - takes 3 columns (60%) */}
      <div className="xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{culinaryId ? "Edit Culinary Item" : "Add New Culinary Item"}</CardTitle>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dish/Item Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Nasi Jamblang"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Restaurant Name</label>
              <Input
                name="restaurant"
                value={formData.restaurant}
                onChange={handleInputChange}
                placeholder="e.g. Warung Nasi Jamblang Bu Eti"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the dish or restaurant"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="seafood">Seafood</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Karawang Barat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <Input
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                placeholder="e.g. Rp 25.000 - Rp 40.000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Google Maps Link</label>
            <Input
              name="googleMapsLink"
              value={formData.googleMapsLink}
              onChange={handleInputChange}
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the Google Maps link for this restaurant
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Opening Hours</label>
            <Input
              name="openingHours"
              value={formData.openingHours}
              onChange={handleInputChange}
              placeholder="e.g. Daily, 10:00 AM - 8:00 PM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Specialties (comma separated)</label>
            <Textarea
              value={specialtiesInput}
              onChange={(e) => setSpecialtiesInput(e.target.value)}
              placeholder="e.g. Nasi Jamblang Komplit, Ayam Goreng Jamblang, Tahu Tempe Bacem"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <Input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Saving..." : culinaryId ? "Update Item" : "Add Item"}
            </Button>
            <Link href="/admin/culinary">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
      </div>

      {/* Preview Card - takes 2 columns (40%) */}
      <div className="xl:col-span-2">
        <Card className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-gray-500">Live preview of your culinary card</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Card Preview */}
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 w-full bg-gray-200">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.title || "Preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 text-sm font-medium shadow">
                  <span className="text-yellow-400">⭐</span>
                  {Number(formData.rating).toFixed(1)}
                </div>
                {/* Category Badge */}
                {formData.category && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white rounded-full px-2 py-1 text-xs font-medium capitalize">
                    {formData.category}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1 line-clamp-2">
                  {formData.title || "Dish Title"}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                  🍴 {formData.restaurant || "Restaurant Name"}
                </p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {formData.description || "Culinary description will appear here..."}
                </p>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  {formData.location && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">📍</span>
                      <span className="text-gray-700">{formData.location}</span>
                    </div>
                  )}

                  {formData.openingHours && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">🕐</span>
                      <span className="text-gray-700">{formData.openingHours}</span>
                    </div>
                  )}

                  {formData.priceRange && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">💰</span>
                      <span className="text-gray-700">{formData.priceRange}</span>
                    </div>
                  )}

                  {formData.specialties.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">🔥</span>
                      <span className="text-gray-700">{formData.specialties.join(", ")}</span>
                    </div>
                  )}
                </div>

                <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded text-sm flex items-center justify-center gap-1">
                  Find Restaurant →
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
