// NOTE: This component has been updated with dynamic categories similar to destinations-section
"use client"

import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CulinaryCard } from "@/components/culinary-card"
import { getCulinaryItems } from "@/app/actions/culinary"
import { getCategoryCounts, ensureSeedCategories } from "@/app/actions/categories"

interface CulinaryItem {
  id: string
  title: string
  description: string
  image: string
  location: string
  category: string
  rating?: number
  restaurant?: string
  google_maps_link?: string
  specialties?: string[]
  opening_hours?: string
  price_range?: string
}

export function CulinarySection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [allCulinary, setAllCulinary] = React.useState<CulinaryItem[]>([])
  const [categories, setCategories] = React.useState<{ name: string; slug: string; count: number }[]>([])
  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetchCulinary()
    fetchCategories()
  }, [])

  const fetchCulinary = async () => {
    try {
      const result = await getCulinaryItems()
      if (result.success && result.data) {
        setAllCulinary(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to load restaurants")
        console.error("Error fetching culinary:", result.error)
      }
    } catch (error) {
      const errorMessage = "Unable to load restaurants. Please try again later."
      setError(errorMessage)
      console.error("Error fetching culinary:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Seed legacy categories into table if empty
      await ensureSeedCategories()
      const res = await getCategoryCounts('culinary')
      if (res.success && res.data) {
        setCategories(res.data.map((c: any) => ({ name: c.name, slug: c.slug, count: c.item_count })))
      }
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const filteredCulinary = allCulinary.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.restaurant?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesCategory = activeTab === 'all' || item.category === activeTab
    return matchesSearch && matchesCategory
  })
  const topCulinary = filteredCulinary.slice(0, 9)

  if (loading) {
    return (
      <section id="culinary" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl text-center">
          <p className="text-muted-foreground">Loading restaurants...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="culinary" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Restaurants</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={fetchCulinary}
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
    <section id="culinary" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-8 mx-4 md:mx-6">
          <h2 className="text-3xl font-bold mb-4">Top Culinary Experiences</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover the finest restaurants and traditional cuisine that showcase Karawang&apos;s diverse flavors and culinary heritage
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">All ({allCulinary.length})</TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat.slug} value={cat.name}>{cat.name} ({cat.count})</TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-6">
            {topCulinary.length > 0 ? (
              topCulinary.map(item => (
                <CulinaryCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  restaurant={item.restaurant || item.title}
                  rating={item.rating || 0}
                  category={item.category}
                  location={item.location}
                  priceRange={item.price_range}
                  openingHours={item.opening_hours}
                  specialties={item.specialties}
                  googleMapsLink={item.google_maps_link}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No restaurants found for this category.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Link href="/culinary">
            <Button className="bg-emerald-600 hover:bg-emerald-700">View All Restaurants</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
