"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, X, MapPin, Star, Zap, Trees, Landmark, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DestinationCard } from "@/components/destination-card"
import { getDestinations } from "@/app/actions/destinations"
import { getCategories } from "@/app/actions/categories"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Destination {
  id: string
  title: string
  description: string
  image: string
  location: string
  category: "nature" | "historical" | "recreational"
  rating: number
  google_maps_link?: string
  facilities?: string[]
  best_time_to_visit?: string
  entrance_fee?: string
}

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [ratingFilter, setRatingFilter] = React.useState<number[]>([0])
  const [allDestinations, setAllDestinations] = React.useState<Destination[]>([])
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [destResult, catResult] = await Promise.all([
          getDestinations(),
          getCategories('destination')
        ])
        
        if (destResult.success && destResult.data) {
          setAllDestinations(destResult.data)
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

  const filteredDestinations = allDestinations.filter((destination) => {
    // Search filter
    const matchesSearch =
      destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || destination.category === categoryFilter

    // Rating filter
    const matchesRating = destination.rating >= ratingFilter[0]

    return matchesSearch && matchesCategory && matchesRating
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
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
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore All Destinations</h1>
                  <p className="text-gray-600">Discover {allDestinations.length} amazing places to visit in Karawang</p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"></div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-emerald-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Advanced Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Search */}
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    🔍 Search Location
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-emerald-600" />
                    <Input
                      id="search"
                      placeholder="Search by name, location..."
                      className="pl-12 h-11 border-2 border-gray-200 focus:border-emerald-600 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <Landmark className="h-4 w-4" /> Category
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category" className="h-11 border-2 border-gray-200 focus:border-emerald-600 rounded-lg">
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
                    <span className="text-lg font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
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
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                        Category: {categoryFilter}
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
                    <span className="font-bold text-emerald-600 text-lg">{filteredDestinations.length}</span>
                    <span className="text-gray-600 ml-2">destinations found</span>
                    {filteredDestinations.length !== allDestinations.length && (
                      <span className="text-gray-500 ml-2">
                        (out of {allDestinations.length} total)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Popular choice
                </div>
              </div>
            )}

            {/* Destinations Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="text-gray-600 mt-4">Loading amazing destinations...</p>
                </div>
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Destinations Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("all")
                    setRatingFilter([0])
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <X className="h-4 w-4" /> Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    title={destination.title}
                    description={destination.description}
                    image={destination.image}
                    location={destination.location}
                    googleMapsLink={destination.google_maps_link}
                    facilities={destination.facilities}
                    bestTimeToVisit={destination.best_time_to_visit}
                    entranceFee={destination.entrance_fee}
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
