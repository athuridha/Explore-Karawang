"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, UtensilsCrossed, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ActivityItem {
  id: string
  title: string
  type: "destination" | "culinary"
  date: string
  category?: string
}

interface RecentActivityProps {
  items?: ActivityItem[]
}

export function RecentActivity({ items = [] }: RecentActivityProps) {
  const displayItems = items.slice(0, 6)

  return (
    <Card className="md:col-span-2 lg:col-span-3 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest additions to your content</CardDescription>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              No recent activity yet. Start by adding new destinations or culinary items.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      item.type === "destination"
                        ? "bg-blue-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    {item.type === "destination" ? (
                      <MapPin className="w-5 h-5 text-blue-600" />
                    ) : (
                      <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {item.type === "destination"
                          ? "Destination"
                          : "Culinary"}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  asChild
                >
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
          <Link href="/admin/destinations" className="flex-1">
            <Button variant="outline" className="w-full">
              View All Destinations
            </Button>
          </Link>
          <Link href="/admin/culinary" className="flex-1">
            <Button variant="outline" className="w-full">
              View All Culinary
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
