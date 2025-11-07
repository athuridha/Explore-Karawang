"use client"

import Link from "next/link"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addCarouselSlide, updateCarouselSlide, getCarouselSlideById } from "@/app/actions/carousel"

interface CarouselFormProps {
  slideId?: string
}

interface FormData {
  title: string
  description: string
  image: string
  buttonText1: string
  buttonLink1: string
  buttonText2: string
  buttonLink2: string
  slideOrder: number
  isActive: boolean
}

export function CarouselForm({ slideId }: CarouselFormProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(!!slideId)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    description: "",
    image: "",
    buttonText1: "Explore Destinations",
    buttonLink1: "/destinations",
    buttonText2: "Culinary Adventures",
    buttonLink2: "/culinary",
    slideOrder: 1,
    isActive: true,
  })

  React.useEffect(() => {
    if (slideId) {
      fetchSlide()
    }
  }, [slideId])

  const fetchSlide = async () => {
    if (!slideId) return

    setFetching(true)
    const result = await getCarouselSlideById(slideId)
    if (result.success && result.data) {
      const d = result.data
      setFormData({
        title: d.title,
        description: d.description,
        image: d.image || "",
        buttonText1: d.button_text_1 || "",
        buttonLink1: d.button_link_1 || "",
        buttonText2: d.button_text_2 || "",
        buttonLink2: d.button_link_2 || "",
        slideOrder: d.slide_order,
        isActive: d.is_active,
      })
    } else {
      setError("Failed to load slide")
    }
    setFetching(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "slideOrder" ? Number.parseInt(value) : value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result
      if (slideId) {
        result = await updateCarouselSlide(slideId, formData)
      } else {
        result = await addCarouselSlide(formData)
      }

      if (result.success) {
        router.push("/admin/carousel")
      } else {
        setError(result.error || "Failed to save slide")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center py-8">Loading slide...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{slideId ? "Edit Carousel Slide" : "Add New Carousel Slide"}</CardTitle>
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
                placeholder="e.g. Discover Karawang"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slide Order</label>
              <Input
                type="number"
                name="slideOrder"
                value={formData.slideOrder}
                onChange={handleInputChange}
                min="1"
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
              placeholder="Brief description of the slide"
              rows={3}
              required
            />
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

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Button 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <Input
                  name="buttonText1"
                  value={formData.buttonText1}
                  onChange={handleInputChange}
                  placeholder="e.g. Explore Destinations"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Button Link</label>
                <Input
                  name="buttonLink1"
                  value={formData.buttonLink1}
                  onChange={handleInputChange}
                  placeholder="/destinations"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Button 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <Input
                  name="buttonText2"
                  value={formData.buttonText2}
                  onChange={handleInputChange}
                  placeholder="e.g. Culinary Adventures"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Button Link</label>
                <Input
                  name="buttonLink2"
                  value={formData.buttonLink2}
                  onChange={handleInputChange}
                  placeholder="/culinary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active (Show in carousel)
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Saving..." : slideId ? "Update Slide" : "Add Slide"}
            </Button>
            <Link href="/admin/carousel">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
