export interface DestinationProps {
  title: string
  description: string
  image: string
  location: string
  googleMapsLink?: string
  facilities?: string[]
  bestTimeToVisit?: string
  entranceFee?: string
  category?: string // now dynamic from categories admin
}

export interface CulinaryProps {
  title: string
  description: string
  image: string
  restaurant: string
  rating: number
  category?: string // dynamic category name
  location?: string
  priceRange?: string
  openingHours?: string
  specialties?: string[]
  facilities?: string[]
  googleMapsLink?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  type: 'destination' | 'culinary'
  created_at?: string
}
