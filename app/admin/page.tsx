"use client"

import Link from "next/link"
import { Plus, Edit2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { AdminLayout } from "@/components/admin/admin-layout"
import * as React from "react"
import { getDestinations } from "@/app/actions/destinations"
import { getCulinaryItems } from "@/app/actions/culinary"

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    destinations: 0,
    culinary: 0,
    categories: 0,
    recentItems: [] as any[],
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    const [destResult, culResult] = await Promise.all([getDestinations(), getCulinaryItems()])

    const destinations = destResult.success ? destResult.data || [] : []
    const culinary = culResult.success ? culResult.data || [] : []

    // Get unique categories
    const categories = new Set([
      ...destinations.map((d: any) => d.category),
      ...culinary.map((c: any) => c.category),
    ])

    // Combine and sort by date
    const allItems = [
      ...destinations.map((d: any) => ({
        id: d.id,
        title: d.title,
        type: "destination" as const,
        date: new Date(d.created_at || Date.now()),
      })),
      ...culinary.map((c: any) => ({
        id: c.id,
        title: c.title,
        type: "culinary" as const,
        date: new Date(c.created_at || Date.now()),
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime())

    setStats({
      destinations: destinations.length,
      culinary: culinary.length,
      categories: categories.size,
      recentItems: allItems.slice(0, 6).map((item) => ({
        ...item,
        date: formatRelativeTime(item.date),
      })),
    })
    setLoading(false)
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
    return date.toLocaleDateString()
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s your content overview.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <DashboardStats
            destinationsCount={stats.destinations}
            culinaryCount={stats.culinary}
            totalCategories={stats.categories}
            totalReviews={stats.recentItems.length}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Recent Activity */}
            <RecentActivity items={stats.recentItems} />

            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Fast access to common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/destinations/add" className="block">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Destination
                  </Button>
                </Link>
                <Link href="/admin/culinary/add" className="block">
                  <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Culinary
                  </Button>
                </Link>
                <Link href="/admin/destinations" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Eye className="w-4 h-4" />
                    View Destinations
                  </Button>
                </Link>
                <Link href="/admin/culinary" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Eye className="w-4 h-4" />
                    View Culinary
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destinations Card */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:border-blue-300">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  Destinations Management
                </CardTitle>
                <CardDescription>
                  Create, edit, and manage tourism destinations across the region
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage tourism locations including nature sites, historical monuments, recreational areas,
                  and cultural heritage. Add images, descriptions, facilities, and more.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/admin/destinations/add" className="block">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                      <Plus className="w-4 h-4" /> Add New
                    </Button>
                  </Link>
                  <Link href="/admin/destinations" className="block">
                    <Button size="sm" variant="outline" className="w-full gap-2">
                      <Edit2 className="w-4 h-4" /> Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Culinary Card */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:border-emerald-300">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Eye className="w-5 h-5 text-emerald-600" />
                  </div>
                  Culinary Management
                </CardTitle>
                <CardDescription>
                  Create and manage restaurants, dishes, and food recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage culinary content including restaurant profiles, signature dishes, pricing information,
                  specialties, and user reviews. Showcase local and international cuisine.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/admin/culinary/add" className="block">
                    <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                      <Plus className="w-4 h-4" /> Add New
                    </Button>
                  </Link>
                  <Link href="/admin/culinary" className="block">
                    <Button size="sm" variant="outline" className="w-full gap-2">
                      <Edit2 className="w-4 h-4" /> Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
