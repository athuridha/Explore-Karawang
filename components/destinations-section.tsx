"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DestinationCard } from "@/components/destination-card"
import { getDestinations } from "@/app/actions/destinations"
import { getCategoryCounts, ensureSeedCategories } from "@/app/actions/categories"

interface Destination {
  id: string
  title: string
  description: string
  image: string
  location: string
  category: string
  google_maps_link?: string
  facilities?: string[]
  best_time_to_visit?: string
  entrance_fee?: string
}

export function DestinationsSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [allDestinations, setAllDestinations] = React.useState<Destination[]>([])
  const [categories, setCategories] = React.useState<{ name: string; slug: string; count: number }[]>([])
  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchDestinations()
    fetchCategories()
  }, [])

  const fetchDestinations = async () => {
    try {
      const result = await getDestinations()
      if (result.success && result.data) {
        setAllDestinations(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to load destinations")
        console.error("Error fetching destinations:", result.error)
      }
    } catch (error) {
      const errorMessage = "Unable to load destinations. Please try again later."
      setError(errorMessage)
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Seed legacy categories into table if empty
      await ensureSeedCategories()
      const res = await getCategoryCounts('destination')
      if (res.success && res.data) {
        setCategories(res.data.map((c: any) => ({ name: c.name, slug: c.slug, count: c.item_count })))
      }
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const filteredDestinations = allDestinations.filter(dest => {
    const matchesSearch =
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeTab === 'all' || dest.category === activeTab
    return matchesSearch && matchesCategory
  })
  const topDestinations = filteredDestinations.slice(0, 9)

  if (loading) {
    return (
      <section id="destinations" className="py-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl text-center">
          <p className="text-muted-foreground">Loading destinations...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="destinations" className="py-16">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Destinations</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={fetchDestinations}
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
    <section id="destinations" className="py-16">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-8 mx-4 md:mx-6">
          <h2 className="text-3xl font-bold mb-4">Top Tourism Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore the natural beauty, historical sites, and recreational spots that make Karawang a must-visit
            destination
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">All ({allDestinations.length})</TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat.slug} value={cat.name}>{cat.name} ({cat.count})</TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-6">
            {topDestinations.length > 0 ? (
              topDestinations.map(destination => (
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
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No destinations found for this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Link href="/destinations">
            <Button className="bg-emerald-600 hover:bg-emerald-700">View All Destinations</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
