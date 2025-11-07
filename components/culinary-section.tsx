"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CulinaryCard } from "@/components/culinary-card"
import { getCulinaryItems } from "@/app/actions/culinary"

interface CulinaryItem {
  id: string
  title: string
  description: string
  image: string
  restaurant: string
  rating: number
  category: string
  location: string
  price_range: string
  opening_hours: string
  specialties: string[]
  created_at: string
  updated_at: string
  google_maps_link?: string
}

export function CulinarySection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [allItems, setAllItems] = React.useState<CulinaryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchCulinaryItems()
  }, [])

  const fetchCulinaryItems = async () => {
    try {
      const result = await getCulinaryItems()
      if (result.success && result.data) {
        setAllItems(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to load culinary items")
        console.error("Error fetching culinary items:", result.error)
      }
    } catch (error) {
      const errorMessage = "Unable to load culinary items. Please try again later."
      setError(errorMessage)
      console.error("Error fetching culinary items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = allItems
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 6)

  if (loading) {
    return (
      <section id="culinary" className="py-16 bg-muted">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl text-center">
          <p className="text-muted-foreground">Loading culinary items...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="culinary" className="py-16 bg-muted">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Culinary Items</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={fetchCulinaryItems}
              variant="outline"
              className="text-red-700 border-red-300 bg-transparent"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="culinary" className="py-16 bg-muted">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-8 mx-4 md:mx-6">
          <h2 className="text-3xl font-bold mb-4">Culinary Delights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Savor the authentic flavors of Karawang with these must-try local dishes and recommended restaurants
          </p>

          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search culinary delights..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 md:mx-6">
            {filteredItems.map((item) => (
              <CulinaryCard
                key={item.id}
                title={item.title}
                description={item.description}
                image={item.image}
                restaurant={item.restaurant}
                rating={item.rating}
                category={item.category}
                location={item.location}
                priceRange={item.price_range}
                openingHours={item.opening_hours}
                specialties={item.specialties}
                googleMapsLink={item.google_maps_link}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm mx-4 md:mx-6">
            <p className="text-muted-foreground mb-4">No culinary items found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link href="/culinary">
            <Button className="bg-emerald-600 hover:bg-emerald-700">View All Culinary</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
