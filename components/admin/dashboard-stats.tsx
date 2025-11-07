"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, UtensilsCrossed, Users, TrendingUp } from "lucide-react"

interface StatsProps {
  destinationsCount?: number
  culinaryCount?: number
  totalCategories?: number
  totalReviews?: number
}

export function DashboardStats({
  destinationsCount = 0,
  culinaryCount = 0,
  totalCategories = 0,
  totalReviews = 0,
}: StatsProps) {
  const stats = [
    {
      title: "Destinations",
      value: destinationsCount,
      description: "Tourism locations",
      icon: <MapPin className="w-6 h-6" />,
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Culinary Items",
      value: culinaryCount,
      description: "Restaurants & dishes",
      icon: <UtensilsCrossed className="w-6 h-6" />,
      bgGradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Categories",
      value: totalCategories,
      description: "Total categories",
      icon: <TrendingUp className="w-6 h-6" />,
      bgGradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Recent Activity",
      value: totalReviews,
      description: "Recent updates",
      icon: <Users className="w-6 h-6" />,
      bgGradient: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <CardDescription className="text-xs">{stat.description}</CardDescription>
            </div>
            <div
              className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-lg shadow-md`}
            >
              <div className="text-white">{stat.icon}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-2">
              +0 from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
