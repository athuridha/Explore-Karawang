"use client"

import * as React from "react"
import Link from "next/link"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/admin-layout"
import { getAllCarouselSlides, deleteCarouselSlide, type CarouselSlide } from "@/app/actions/carousel"

export default function CarouselPage() {
  const [slides, setSlides] = React.useState<CarouselSlide[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    const result = await getAllCarouselSlides()
    if (result.success && result.data) {
      setSlides(result.data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return

    const result = await deleteCarouselSlide(id)
    if (result.success) {
      fetchSlides()
    } else {
      alert("Failed to delete slide")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carousel Slides</h1>
            <p className="text-gray-600 mt-1">Manage homepage carousel slides</p>
          </div>
          <Link href="/admin/carousel/add">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No carousel slides found</p>
            <Link href="/admin/carousel/add">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Add Your First Slide</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell className="font-medium">{slide.slide_order}</TableCell>
                    <TableCell className="font-medium">{slide.title}</TableCell>
                    <TableCell className="max-w-md truncate">{slide.description}</TableCell>
                    <TableCell>
                      {slide.is_active ? (
                        <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(slide.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/carousel/${slide.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(slide.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
