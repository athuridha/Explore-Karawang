import Image from "next/image"
import { ExternalLink, Star, Utensils, MapPin, Clock, DollarSign, Flame } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CulinaryProps } from "@/types"

export function CulinaryCard({
  title,
  description,
  image,
  restaurant,
  rating,
  category,
  location,
  priceRange,
  openingHours,
  specialties,
  googleMapsLink,
}: CulinaryProps) {
  const handleFindRestaurant = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank')
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          src={image || "/placeholder.svg?height=192&width=400&query=culinary"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 text-sm font-medium shadow">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {rating}
        </div>
        {category && (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white rounded-full px-2 py-1 text-xs font-medium capitalize">
            {category}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Utensils className="h-4 w-4 flex-shrink-0" /> {restaurant}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="space-y-2 text-sm">
          {location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{location}</span>
            </div>
          )}

          {openingHours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{openingHours}</span>
            </div>
          )}

          {priceRange && (
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{priceRange}</span>
            </div>
          )}

          {specialties && specialties.length > 0 && (
            <div className="flex items-start gap-2">
              <Flame className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{specialties.join(", ")}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1"
          onClick={handleFindRestaurant}
          disabled={!googleMapsLink}
        >
          Find Restaurant <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
