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
  avg_rating?: number // calculated from ratings table
  ratings_count?: number // total number of ratings
}

export interface CulinaryProps {
  title: string
  description: string
  image: string
  restaurant: string
  category?: string // dynamic category name
  location?: string
  priceRange?: string
  openingHours?: string
  specialties?: string[]
  facilities?: string[]
  googleMapsLink?: string
  avg_rating?: number // calculated from ratings table
  ratings_count?: number // total number of ratings
}

export interface Category {
  id: string
  name: string
  slug: string
  type: 'destination' | 'culinary'
  created_at?: string
}

// Owner submission (pending approval by admin before becoming a destination/culinary)
export interface OwnerSubmission {
  id: string
  submitter_name: string
  submitter_email?: string
  submitter_phone?: string
  item_type: 'destination' | 'culinary'
  payload: any // raw submitted JSON (form fields)
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  approved_at?: string
  created_at?: string
  updated_at?: string
}

// Rating / review for an item
export interface RatingRecord {
  id: string
  item_type: 'destination' | 'culinary'
  item_id: string
  device_id: string
  rating: number
  comment?: string
  media?: string[] // array of uploaded media URLs
  visible: boolean
  created_at?: string
}

export interface CreateRatingInput {
  item_type: 'destination' | 'culinary'
  item_id: string
  rating: number
  comment?: string
  media?: string[]
}

export interface CreateSubmissionInput {
  submitter_name: string
  submitter_email?: string
  submitter_phone?: string
  item_type: 'destination' | 'culinary'
  // Common fields
  title: string
  description: string
  location: string
  image?: string
  category?: string
  googleMapsLink?: string
  // Culinary specific
  restaurant?: string
  priceRange?: string
  openingHours?: string
  specialties?: string[]
  facilities?: string[]
}
