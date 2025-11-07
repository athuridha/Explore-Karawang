import { AdminLayout } from "@/components/admin/admin-layout"
import { CarouselForm } from "@/components/carousel-form"

export default function AddCarouselPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Carousel Slide</h1>
          <p className="text-gray-600 mt-1">Create a new slide for the homepage carousel</p>
        </div>
        <CarouselForm />
      </div>
    </AdminLayout>
  )
}
