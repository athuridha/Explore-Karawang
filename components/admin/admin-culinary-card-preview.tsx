"use client"

import * as React from "react"
import Image from "next/image"
import { MapPin, Clock, DollarSign, Star, Check, Edit, Trash2, Flame } from "lucide-react"

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
import Link from "next/link"

interface AdminCulinaryCardPreviewProps {
  id: string
  title: string
  description: string
  image: string
  restaurant: string
  location: string
  category: string
  rating: number
  priceRange?: string
  openingHours?: string
  specialties?: string[]
  googleMapsLink?: string
  facilities?: string[]
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function AdminCulinaryCardPreview({
  id,
  title,
  description,
  image,
  restaurant,
  location,
  category,
  rating,
  priceRange,
  openingHours,
  specialties = [],
  googleMapsLink,
  facilities = [],
  onDelete,
  isDeleting = false,
}: AdminCulinaryCardPreviewProps) {
  const [open, setOpen] = React.useState(false)

  // Parse facilities and specialties - handle both string CSV and array formats
  const displayFacilities = React.useMemo(() => {
    if (!facilities) return []
    if (Array.isArray(facilities)) return facilities
    if (typeof facilities === 'string') {
      return facilities.split(',').map(f => f.trim()).filter(f => f.length > 0)
    }
    return []
  }, [facilities])

  const displaySpecialties = React.useMemo(() => {
    if (!specialties) return []
    if (Array.isArray(specialties)) return specialties
    if (typeof specialties === 'string') {
      return specialties.split(',').map(s => s.trim()).filter(s => s.length > 0)
    }
    return []
  }, [specialties])

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
        {/* Image Section */}
        <div 
          className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 group cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={restaurant || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm font-semibold text-gray-900 shadow-lg">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {rating}
          </div>

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white rounded-full px-3 py-1 text-xs font-bold capitalize shadow-lg">
              {category}
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4 flex flex-col">
          {/* Restaurant Name */}
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">
            {restaurant || title}
          </h3>

          {/* Dish/Title */}
          {title && title !== restaurant && (
            <div className="flex items-center gap-1 mb-2 text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-1 rounded-full w-fit">
              {title}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
            {description}
          </p>

          {/* Specialties & Facilities Preview */}
          {(displaySpecialties.length > 0 || displayFacilities.length > 0) && (
            <div className="flex gap-1 mb-3 flex-wrap">
              {displaySpecialties.slice(0, 1).map((specialty, index) => (
                <div
                  key={`sp-${index}`}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg font-medium"
                >
                  <Flame className="h-2.5 w-2.5 inline mr-1" />
                  {specialty}
                </div>
              ))}
              {displayFacilities.slice(0, 1).map((facility, index) => (
                <div
                  key={`fac-${index}`}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                >
                  {facility}
                </div>
              ))}
              {(displaySpecialties.length + displayFacilities.length > 2) && (
                <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                  +{displaySpecialties.length + displayFacilities.length - 2} more
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View Details
            </Button>
            <Link href={`/admin/culinary/${id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Edit className="h-3 w-3" /> Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => onDelete(id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
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
              src={image || "/placeholder.svg"} 
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
            {(category || rating) && (
              <div className="grid grid-cols-2 gap-4">
                {category && (
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-emerald-600" />
                      <h4 className="font-semibold text-gray-900">Category</h4>
                    </div>
                    <p className="text-sm text-gray-700 capitalize font-medium">{category}</p>
                  </div>
                )}
                {rating && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                      <h4 className="font-semibold text-gray-900">Rating</h4>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{rating} / 5.0</p>
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
                  {displayFacilities.map((facility, index) => (
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
                  {displaySpecialties.map((specialty, index) => (
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
            <Link href={`/admin/culinary/${id}/edit`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold gap-2">
                <Edit className="h-4 w-4" />
                Edit Details
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
