"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, X, MapPin, Star, Zap, Flame, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { CulinaryCard } from "@/components/culinary-card"
import { getCulinaryItems } from "@/app/actions/culinary"
import { getCategories } from "@/app/actions/categories"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface CulinaryItem {
  id: string
  title: string
  description: string
  image: string
  restaurant: string
  category: string
  location: string
  price_range: string
  opening_hours: string
  specialties: string[]
  facilities?: string[]
  created_at: string
  updated_at: string
  google_maps_link?: string
  avg_rating: number
  ratings_count: number
}

export default function CulinaryPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [ratingFilter, setRatingFilter] = React.useState<number[]>([0])
  const [allItems, setAllItems] = React.useState<CulinaryItem[]>([])
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [culResult, catResult] = await Promise.all([
          getCulinaryItems(),
          getCategories('culinary')
        ])
        
        if (culResult.success && culResult.data) {
          setAllItems(culResult.data)
        }
        if (catResult.success && catResult.data) {
          setCategories(catResult.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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
    const matchesRating = item.avg_rating >= ratingFilter[0]

    return matchesSearch && matchesCategory && matchesRating
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
          <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12">
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Culinary Delights</h1>
                  <p className="text-gray-600">Discover {allItems.length} amazing restaurants & dishes in Karawang</p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-orange-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Advanced Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Search */}
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    🔍 Search Restaurant
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-orange-600" />
                    <Input
                      id="search"
                      placeholder="Search by name, location..."
                      className="pl-12 h-11 border-2 border-gray-200 focus:border-orange-600 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4" /> Cuisine Type
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category" className="h-11 border-2 border-gray-200 focus:border-orange-600 rounded-lg">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="rating" className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      ⭐ Min Rating
                    </label>
                    <span className="text-lg font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {ratingFilter[0].toFixed(1)}
                    </span>
                  </div>
                  <Slider 
                    id="rating" 
                    min={0} 
                    max={5} 
                    step={0.1} 
                    value={ratingFilter} 
                    onValueChange={setRatingFilter}
                    className="mt-4"
                  />
                </div>
              </div>

              {/* Active Filters & Reset */}
              {(searchQuery || categoryFilter !== "all" || ratingFilter[0] > 0) && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        Search: {searchQuery}
                      </span>
                    )}
                    {categoryFilter !== "all" && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                        Type: {categoryFilter}
                      </span>
                    )}
                    {ratingFilter[0] > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                        Rating: ≥ {ratingFilter[0].toFixed(1)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setCategoryFilter("all")
                      setRatingFilter([0])
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" /> Reset
                  </Button>
                </div>
              )}
            </div>

            {/* Results Info */}
            {!loading && (
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-gray-700">
                    <span className="font-bold text-orange-600 text-lg">{filteredItems.length}</span>
                    <span className="text-gray-600 ml-2">restaurants found</span>
                    {filteredItems.length !== allItems.length && (
                      <span className="text-gray-500 ml-2">
                        (out of {allItems.length} total)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Flame className="h-4 w-4 text-red-500" />
                  Trending
                </div>
              </div>
            )}

            {/* Culinary Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  <p className="text-gray-600 mt-4">Loading delicious restaurants...</p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Restaurants Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("all")
                    setRatingFilter([0])
                  }}
                  className="bg-orange-600 hover:bg-orange-700 gap-2"
                >
                  <X className="h-4 w-4" /> Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <CulinaryCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    restaurant={item.restaurant}
                    avg_rating={item.avg_rating}
                    ratings_count={item.ratings_count}
                    category={item.category}
                    location={item.location}
                    priceRange={item.price_range}
                    openingHours={item.opening_hours}
                    specialties={item.specialties}
                    facilities={item.facilities}
                    googleMapsLink={item.google_maps_link}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
