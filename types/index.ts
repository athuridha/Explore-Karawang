export interface DestinationProps {
  title: string
  description: string
  image: string
  location: string
  googleMapsLink?: string
  facilities?: string[]
  bestTimeToVisit?: string
  entranceFee?: string
}

export interface CulinaryProps {
  title: string
  description: string
  image: string
  restaurant: string
  rating: number
  category?: string
  location?: string
  priceRange?: string
  openingHours?: string
  specialties?: string[]
  googleMapsLink?: string
}
