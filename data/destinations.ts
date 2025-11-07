export interface Destination {
  id: string
  title: string
  description: string
  image: string
  location: string
  category: "nature" | "historical" | "recreational"
  facilities: string[]
  bestTimeToVisit: string
  entranceFee: string
  rating: number
}

export const destinations: Destination[] = []
