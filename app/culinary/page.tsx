"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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

export default function CulinaryPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [ratingFilter, setRatingFilter] = React.useState<number[]>([0])
  const [allItems, setAllItems] = React.useState<CulinaryItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchCulinaryItems()
  }, [])

  const fetchCulinaryItems = async () => {
    try {
      const result = await getCulinaryItems()
      if (result.success && result.data) {
        setAllItems(result.data)
      } else {
        console.error("Error fetching culinary items:", result.error)
      }
    } catch (error) {
      console.error("Error fetching culinary items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = allItems.filter((item) => {
    // Search filter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    // Rating filter
    const matchesRating = item.rating >= ratingFilter[0]

    return matchesSearch && matchesCategory && matchesRating
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Explore Culinary Delights</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search restaurants..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="seafood">Seafood</SelectItem>
                  <SelectItem value="snack">Snacks</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="rating" className="text-sm font-medium">
                  Minimum Rating
                </label>
                <span className="text-sm">{ratingFilter[0].toFixed(1)}</span>
              </div>
              <Slider id="rating" min={0} max={5} step={0.1} value={ratingFilter} onValueChange={setRatingFilter} />
            </div>
          </div>
        </div>

        {/* Results */}
        {!loading && (
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing {filteredItems.length} of {allItems.length} culinary items
            </p>
          </div>
        )}

        {/* Culinary Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading culinary items...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No culinary items found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("all")
                    setRatingFilter([0])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
