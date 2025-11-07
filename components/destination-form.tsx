"use client"

import Link from "next/link"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addDestination, updateDestination, getDestinationById } from "@/app/actions/destinations"

// Daftar facilities yang tersedia
const AVAILABLE_FACILITIES = [
  "Parking",
  "Restrooms",
  "Food Stalls",
  "Souvenir Shop",
  "Prayer Room",
  "Wheelchair Access",
  "Playground",
  "Camping Area",
  "WiFi",
  "Guide Services",
]

interface DestinationFormProps {
  destinationId?: string
}

interface FormData {
  title: string
  description: string
  image: string
  location: string
  category: "nature" | "historical" | "recreational"
  facilities: string[]
  bestTimeToVisit: string
  entranceFee: string
  rating: number
  googleMapsLink: string
}

export function DestinationForm({ destinationId }: DestinationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(!!destinationId)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    description: "",
    image: "",
    location: "",
    category: "nature",
    facilities: [],
    bestTimeToVisit: "",
    entranceFee: "",
    rating: 4.5,
    googleMapsLink: "",
  })

  React.useEffect(() => {
    if (destinationId) {
      fetchDestination()
    }
  }, [destinationId])

  const fetchDestination = async () => {
    if (!destinationId) return

    setFetching(true)
    const result = await getDestinationById(destinationId)
    if (result.success && result.data) {
      const d = result.data
      setFormData({
        title: d.title,
        description: d.description,
        image: d.image || "",
        location: d.location,
        category: d.category,
        facilities: d.facilities || [],
        bestTimeToVisit: d.best_time_to_visit || "",
        entranceFee: d.entrance_fee || "",
        rating: d.rating,
        googleMapsLink: d.google_maps_link || "",
      })
    } else {
      setError("Failed to load destination")
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
      category: value as "nature" | "historical" | "recreational",
    }))
  }

  const handleFacilityToggle = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result
      if (destinationId) {
        result = await updateDestination(destinationId, formData)
      } else {
        result = await addDestination(formData)
      }

      if (result.success) {
        router.push("/admin/destinations")
      } else {
        setError(result.error || "Failed to save destination")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center py-8">Loading destination...</div>
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Form Card - takes 3 columns (60%) */}
      <div className="xl:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{destinationId ? "Edit Destination" : "Add New Destination"}</CardTitle>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Pantai Tanjung Pakis"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Tanjung Pakis, Pakis Jaya"
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
              placeholder="Detailed description of the destination"
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
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="recreational">Recreational</SelectItem>
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

          <div>
            <label className="block text-sm font-medium mb-2">Google Maps Link</label>
            <Input
              name="googleMapsLink"
              value={formData.googleMapsLink}
              onChange={handleInputChange}
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the Google Maps link for this destination
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Facilities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
              {AVAILABLE_FACILITIES.map((facility) => (
                <label
                  key={facility}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Best Time to Visit</label>
              <Input
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleInputChange}
                placeholder="e.g. Weekdays, 8:00 AM - 4:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Entrance Fee</label>
              <Input
                name="entranceFee"
                value={formData.entranceFee}
                onChange={handleInputChange}
                placeholder="e.g. Rp 10.000 - Rp 25.000"
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
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Saving..." : destinationId ? "Update Destination" : "Add Destination"}
            </Button>
            <Link href="/admin/destinations">
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
          <p className="text-sm text-gray-500">Live preview of your destination card</p>
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
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  {formData.title || "Destination Title"}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                  📍 {formData.location || "Location"}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  {formData.description || "Destination description will appear here..."}
                </p>

                {/* Facilities Preview */}
                {formData.facilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Facilities:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {formData.facilities.slice(0, 4).map((facility, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs">
                          <span className="text-emerald-600">✓</span>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                    {formData.facilities.length > 4 && (
                      <p className="text-xs text-gray-500 mt-1">
                        +{formData.facilities.length - 4} more
                      </p>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="space-y-2 text-sm border-t pt-3">
                  <div>
                    <span className="font-medium">Category:</span>{" "}
                    <span className="capitalize">{formData.category}</span>
                  </div>
                  {formData.bestTimeToVisit && (
                    <div>
                      <span className="font-medium">Best Time:</span>{" "}
                      <span className="text-gray-600">{formData.bestTimeToVisit}</span>
                    </div>
                  )}
                  {formData.entranceFee && (
                    <div>
                      <span className="font-medium">Entrance Fee:</span>{" "}
                      <span className="text-gray-600">{formData.entranceFee}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Rating:</span>{" "}
                    <span className="text-yellow-600">⭐ {Number(formData.rating).toFixed(1)}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gray-100 border text-gray-700 py-2 px-4 rounded text-sm">
                  View Details
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
