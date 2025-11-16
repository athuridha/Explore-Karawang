import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { ExternalLink, Star, Utensils, MapPin, Clock, DollarSign, Flame, ArrowUpRight, Check } from "lucide-react"

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
import type { CulinaryProps } from "@/types"

export function CulinaryCard({
  id,
  title,
  description,
  image,
  restaurant,
  category,
  location,
  priceRange,
  openingHours,
  specialties,
  googleMapsLink,
  facilities,
  avg_rating = 0,
  ratings_count = 0,
}: CulinaryProps & { id: string }) {
  const [open, setOpen] = React.useState(false)

  const handleFindRestaurant = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank')
    }
  }

  // Parse facilities and specialties - handle both string CSV and array formats
  const displayFacilities = React.useMemo(() => {
    if (!facilities) return []
    if (Array.isArray(facilities)) return facilities
    if (typeof facilities === 'string') {
      return (facilities as string).split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
    }
    return []
  }, [facilities])

  const displaySpecialties = React.useMemo(() => {
    if (!specialties) return []
    if (Array.isArray(specialties)) return specialties
    if (typeof specialties === 'string') {
      return (specialties as string).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    }
    return []
  }, [specialties])

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white cursor-pointer" onClick={() => setOpen(true)}>
        {/* Image Section */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 group">
          <Image
            src={image || "/placeholder.svg?height=224&width=400&query=culinary"}
            alt={restaurant || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Rating Badge */}
          {avg_rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm font-semibold text-gray-900 shadow-lg">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {Number(avg_rating).toFixed(1)}
              {ratings_count > 0 && (
                <span className="text-xs text-gray-600 ml-1">({ratings_count})</span>
              )}
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white rounded-full px-3 py-1 text-xs font-bold capitalize shadow-lg">
              {category}
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-5 flex flex-col">
          {/* Restaurant Name */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1 leading-tight">
            {restaurant || title}
          </h3>

          {/* Dish/Title */}
          {title && title !== restaurant && (
            <div className="flex items-center gap-1 mb-3 text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-1 rounded-full w-fit">
              <Utensils className="h-3 w-3" />
              {title}
            </div>
          )}

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
          <div className="flex gap-2 mb-4 text-xs flex-wrap">
            {priceRange && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-blue-700 font-medium">
                <DollarSign className="h-3 w-3" />
                <span className="line-clamp-1">{priceRange}</span>
              </div>
            )}
            {openingHours && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full text-purple-700 font-medium">
                <Clock className="h-3 w-3" />
                <span className="line-clamp-1">{openingHours}</span>
              </div>
            )}
          </div>

          {/* Specialties Preview */}
          {displaySpecialties.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {displaySpecialties.slice(0, 2).map((specialty: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Flame className="h-3 w-3" />
                  <span className="line-clamp-1">{specialty}</span>
                </div>
              ))}
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
                  <Check className="h-3 w-3" />
                  <span className="line-clamp-1">{facility}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <Link href={`/culinary/${id}`} className="w-full">
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
            <DialogTitle className="text-2xl font-bold">{restaurant || title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1 text-base mt-1">
              <MapPin className="h-4 w-4 text-emerald-600" /> {location}
            </DialogDescription>
          </DialogHeader>

          {/* Full Image */}
          <div className="relative h-72 w-full rounded-xl overflow-hidden">
            <Image 
              src={image || "/placeholder.svg?height=224&width=400&query=culinary"} 
              alt={restaurant || title} 
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
              {priceRange && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Price Range</h4>
                  </div>
                  <p className="text-sm text-gray-700">{priceRange}</p>
                </div>
              )}
              {openingHours && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Hours</h4>
                  </div>
                  <p className="text-sm text-gray-700">{openingHours}</p>
                </div>
              )}
            </div>

            {/* Category & Rating */}
            {(category || avg_rating > 0) && (
              <div className="grid grid-cols-2 gap-4">
                {category && (
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="h-5 w-5 text-emerald-600" />
                      <h4 className="font-semibold text-gray-900">Category</h4>
                    </div>
                    <p className="text-sm text-gray-700 capitalize font-medium">{category}</p>
                  </div>
                )}
                {avg_rating > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                      <h4 className="font-semibold text-gray-900">Rating</h4>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{Number(avg_rating).toFixed(1)} / 5.0 ({ratings_count} {ratings_count === 1 ? 'review' : 'reviews'})</p>
                  </div>
                )}
              </div>
            )}

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
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {displaySpecialties.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Specialties
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {displaySpecialties.map((specialty: string, index: number) => (
                    <div
                      key={index}
                      className="bg-red-50 px-3 py-2 rounded-lg border border-red-200 hover:border-red-400 transition-all"
                    >
                      <p className="text-sm text-gray-700 font-medium">{specialty}</p>
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
            <Link href={`/culinary/${id}`} className="flex-1">
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
