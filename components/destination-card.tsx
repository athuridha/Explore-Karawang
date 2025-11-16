"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowUpRight, Star, Clock, DollarSign, Wifi, ParkingCircle, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DestinationProps } from "@/types"

const facilityIcons: Record<string, React.ReactNode> = {
  parking: <ParkingCircle className="h-4 w-4" />,
  wifi: <Wifi className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  restaurant: <Utensils className="h-4 w-4" />,
  default: <MapPin className="h-4 w-4" />,
}

function getFacilityIcon(facility: string): React.ReactNode {
  const lower = facility.toLowerCase()
  for (const [key, icon] of Object.entries(facilityIcons)) {
    if (lower.includes(key)) return icon
  }
  return facilityIcons.default
}

export function DestinationCard({ 
  id,
  title, 
  description, 
  image, 
  location, 
  googleMapsLink, 
  facilities, 
  bestTimeToVisit, 
  entranceFee,
  avg_rating = 0,
  ratings_count = 0
}: DestinationProps & { id: string }) {
  const [open, setOpen] = React.useState(false)

  const handleGetDirections = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank')
    }
  }

  // Parse facilities - handle both string CSV and array formats
  const displayFacilities = React.useMemo(() => {
    if (!facilities) return []
    if (Array.isArray(facilities)) return facilities
    if (typeof facilities === 'string') {
      return (facilities as string).split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
    }
    return []
  }, [facilities])

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white cursor-pointer" onClick={() => setOpen(true)}>
        {/* Image Section */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-blue-50 group">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {avg_rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm font-semibold text-gray-900 shadow-lg">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {Number(avg_rating).toFixed(1)}
              {ratings_count > 0 && (
                <span className="text-xs text-gray-600 ml-1">({ratings_count})</span>
              )}
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-5 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-3 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
            {description}
          </p>

          {/* Quick Info Row */}
          {(bestTimeToVisit || entranceFee) && (
            <div className="flex gap-2 mb-4 text-xs">
              {bestTimeToVisit && (
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-blue-700 font-medium">
                  <Clock className="h-3 w-3" />
                  <span className="line-clamp-1">{bestTimeToVisit.split(',')[0]}</span>
                </div>
              )}
              {entranceFee && (
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full text-emerald-700 font-medium">
                  <DollarSign className="h-3 w-3" />
                  <span className="line-clamp-1">{entranceFee}</span>
                </div>
              )}
            </div>
          )}

          {/* Facilities Preview */}
          {displayFacilities.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {displayFacilities.slice(0, 3).map((facility: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {getFacilityIcon(facility)}
                  <span className="line-clamp-1">{facility}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <Link href={`/destinations/${id}`} className="w-full">
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            >
              View Details
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1 text-base mt-1">
              <MapPin className="h-4 w-4 text-emerald-600" /> {location}
            </DialogDescription>
          </DialogHeader>

          {/* Full Image */}
          <div className="relative h-72 w-full rounded-xl overflow-hidden">
            <Image 
              src={image || "/placeholder.svg"} 
              alt={title} 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="space-y-6 py-4">
            {/* Description */}
            <div>
              <p className="text-base text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {bestTimeToVisit && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Best Time</h4>
                  </div>
                  <p className="text-sm text-gray-700">{bestTimeToVisit}</p>
                </div>
              )}
              {entranceFee && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <h4 className="font-semibold text-gray-900">Entrance Fee</h4>
                  </div>
                  <p className="text-sm text-gray-700">{entranceFee}</p>
                </div>
              )}
            </div>

            {/* Facilities */}
            {displayFacilities.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Available Facilities
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {displayFacilities.map((facility: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                    >
                      {getFacilityIcon(facility)}
                      <span className="text-sm text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with CTA */}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Link href={`/destinations/${id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold">
                View Full Details
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
