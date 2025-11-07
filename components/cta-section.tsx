import Image from "next/image"
import { Button } from "@/components/ui/button"

export function CallToActionSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="bg-emerald-50 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mx-4 md:mx-6">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to explore Karawang?</h2>
            <p className="text-muted-foreground mb-6">
              Plan your perfect trip to Karawang with our comprehensive travel guide and personalized recommendations.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Download Travel Guide
            </Button>
          </div>
          <div className="relative w-full md:w-1/2 h-64 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Karawang Travel Guide"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
