export interface Culinary {
  id: string
  title: string
  description: string
  image: string
  restaurant: string
  location: string
  priceRange: string
  openingHours: string
  specialties: string[]
  rating: number
  category: "traditional" | "seafood" | "snack" | "modern"
}

export const culinaryItems: Culinary[] = []
