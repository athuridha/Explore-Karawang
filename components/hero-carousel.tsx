"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCarouselSlides, type CarouselSlide } from "@/app/actions/carousel"

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [slides, setSlides] = React.useState<CarouselSlide[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    const result = await getCarouselSlides()
    if (result.success && result.data) {
      setSlides(result.data)
    }
    setLoading(false)
  }

  // Auto slide functionality
  React.useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative">
        <div className="relative h-[70vh] w-full overflow-hidden bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Loading carousel...</p>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative">
        <div className="relative h-[70vh] w-full overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Karawang</h1>
            <p className="text-xl max-w-2xl mx-auto">Experience the beauty of West Java</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative">
      <div className="relative h-[70vh] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover brightness-75"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8 lg:px-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h1>
              <p className="text-xl text-white max-w-2xl mb-8">{slide.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {slide.button_text_1 && slide.button_link_1 && (
                  <Link href={slide.button_link_1}>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      {slide.button_text_1}
                    </Button>
                  </Link>
                )}
                {slide.button_text_2 && slide.button_link_2 && (
                  <Link href={slide.button_link_2}>
                    <Button size="lg" variant="outline" className="text-black bg-white/80 border-white hover:bg-white">
                      {slide.button_text_2}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
