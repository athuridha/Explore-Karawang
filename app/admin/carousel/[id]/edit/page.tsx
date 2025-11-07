import { AdminLayout } from "@/components/admin/admin-layout"
import { CarouselForm } from "@/components/carousel-form"

export default function EditCarouselPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Carousel Slide</h1>
          <p className="text-gray-600 mt-1">Update the carousel slide information</p>
        </div>
        <CarouselForm slideId={params.id} />
      </div>
    </AdminLayout>
  )
}
