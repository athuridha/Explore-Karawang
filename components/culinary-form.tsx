"use client"

import Link from "next/link"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { addCulinary, updateCulinary, getCulinaryById } from "@/app/actions/culinary"
import { getCategories } from "@/app/actions/categories"
import { getFacilityPresets } from "@/app/actions/facilities"
import { ImageUploadInput } from "@/components/image-upload-input"

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
  facilities: string[]
  category: string
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
    facilities: [],
    category: "",
    googleMapsLink: "",
  })
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([])
  const [catLoading, setCatLoading] = React.useState(true)
  const [availableFacilities, setAvailableFacilities] = React.useState<string[]>([])
  const [priceMin, setPriceMin] = React.useState(10000)
  const [priceMax, setPriceMax] = React.useState(200000)
  const [openHour, setOpenHour] = React.useState(8)
  const [closeHour, setCloseHour] = React.useState(22)

  const [specialtiesInput, setSpecialtiesInput] = React.useState("")

  React.useEffect(() => {
    if (culinaryId) {
      fetchCulinary()
    }
  }, [culinaryId])

  React.useEffect(() => {
    const loadData = async () => {
      setCatLoading(true)
      const [catRes, facRes] = await Promise.all([
        getCategories('culinary'),
        getFacilityPresets('culinary')
      ])
      if (catRes.success && catRes.data) {
        setCategories(catRes.data.map((c: any) => ({ id: c.id, name: c.name })))
        setFormData(prev => ({ ...prev, category: prev.category || (catRes.data[0]?.name || '') }))
      }
      if (facRes.success && facRes.data) {
        setAvailableFacilities(facRes.data.map((f: any) => f.name))
      }
      setCatLoading(false)
    }
    loadData()
  }, [])

  const fetchCulinary = async () => {
    if (!culinaryId) return

    setFetching(true)
    const result = await getCulinaryById(culinaryId)
    if (result.success && result.data) {
      const d = result.data
      // Parse existing price range
      if (d.price_range) {
        const priceMatch = d.price_range.match(/Rp\.?\s*([\d.]+).*?Rp\.?\s*([\d.]+)/i)
        if (priceMatch) {
          setPriceMin(parseInt(priceMatch[1].replace(/\./g, '')))
          setPriceMax(parseInt(priceMatch[2].replace(/\./g, '')))
        }
      }
      // Parse existing opening hours
      if (d.opening_hours) {
        const hourMatch = d.opening_hours.match(/(\d+).*?(\d+)/)
        if (hourMatch) {
          setOpenHour(parseInt(hourMatch[1]))
          setCloseHour(parseInt(hourMatch[2]))
        }
      }
      
      setFormData({
        title: d.title,
        description: d.description,
        image: d.image || "",
        restaurant: d.restaurant,
        location: d.location,
        priceRange: d.price_range || "",
        openingHours: d.opening_hours || "",
        specialties: d.specialties || [],
        facilities: d.facilities || [],
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
      [name]: value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
  }

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      priceRange: `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`,
      openingHours: `Daily, ${formatTime(openHour)} - ${formatTime(closeHour)}`
    }))
  }, [priceMin, priceMax, openHour, closeHour])

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
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
      title: formData.title || formData.restaurant, // fallback to restaurant name
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
            <CardTitle>{culinaryId ? "Edit Restaurant" : "Add New Restaurant"}</CardTitle>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Name</label>
            <Input
              name="restaurant"
              value={formData.restaurant}
              onChange={handleInputChange}
              placeholder="e.g. Warung Sederhana Karawang"
              required
            />
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
              {catLoading ? (
                <div className="text-sm text-muted-foreground">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="text-sm text-red-500">No categories. Create one first.</div>
              ) : (
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <ImageUploadInput
                label="Image"
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                placeholder="Upload or paste image URL"
                required
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
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Min: {formatPrice(priceMin)}</span>
                    <span className="text-muted-foreground">Max: {formatPrice(priceMax)}</span>
                  </div>
                  <Slider
                    min={5000}
                    max={1000000}
                    step={5000}
                    value={[priceMin, priceMax]}
                    onValueChange={([min, max]) => {
                      setPriceMin(min)
                      setPriceMax(max)
                    }}
                    className="w-full"
                  />
                </div>
                <div className="text-sm font-medium text-emerald-700 bg-emerald-50 p-2 rounded">
                  {formData.priceRange || 'Set price range'}
                </div>
              </div>
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
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Open: {formatTime(openHour)}</span>
                  <span className="text-muted-foreground">Close: {formatTime(closeHour)}</span>
                </div>
                <Slider
                  min={0}
                  max={23}
                  step={1}
                  value={[openHour, closeHour]}
                  onValueChange={([open, close]) => {
                    setOpenHour(open)
                    setCloseHour(close)
                  }}
                  className="w-full"
                />
              </div>
              <div className="text-sm font-medium text-blue-700 bg-blue-50 p-2 rounded">
                {formData.openingHours || 'Set opening hours'}
              </div>
            </div>
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
            <label className="block text-sm font-medium mb-2">Facilities</label>
            {availableFacilities.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-sm">
                No facilities available. Please add some in <a href="/admin/settings" className="font-semibold underline">Settings</a>.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableFacilities.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleFacilityToggle(facility)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Saving..." : culinaryId ? "Update Restaurant" : "Add Restaurant"}
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
                {/* Category Badge */}
                {formData.category && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white rounded-full px-2 py-1 text-xs font-medium capitalize">
                    {formData.category}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1 line-clamp-2">
                  {formData.restaurant || "Restaurant Name"}
                </h3>
                {formData.title && (
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                    🍴 {formData.title}
                  </p>
                )}
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
