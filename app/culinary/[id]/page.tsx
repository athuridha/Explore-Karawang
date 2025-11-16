import { getCulinaryById } from '@/app/actions/culinary'
import { RatingWidget } from '@/components/rating-widget'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

interface Params { params: { id: string } }

export default async function CulinaryDetailPage({ params }: Params) {
  const res = await getCulinaryById(params.id)
  if (!res.success || !res.data) return notFound()
  const c = res.data
  
  const specialties = c.specialties 
    ? (Array.isArray(c.specialties) ? c.specialties : (typeof c.specialties === 'string' ? c.specialties.split(',').map((s: string) => s.trim()) : []))
    : []
  
  const facilities = c.facilities 
    ? (Array.isArray(c.facilities) ? c.facilities : (typeof c.facilities === 'string' ? c.facilities.split(',').map((f: string) => f.trim()) : []))
    : []
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Hero Image */}
        {c.image && (
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img 
              src={c.image} 
              alt={c.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                {c.category && (
                  <Badge className="mb-3">{c.category}</Badge>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{c.title}</h1>
                {c.restaurant && (
                  <p className="text-lg text-gray-600">di {c.restaurant}</p>
                )}
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium">{c.location}</p>
                  {c.google_maps_link && (
                    <a 
                      href={c.google_maps_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 text-sm inline-flex items-center gap-1 mt-1"
                    >
                      Buka di Google Maps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Price and Hours Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {c.price_range && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Kisaran Harga</p>
                      <p className="text-sm font-semibold text-gray-900">{c.price_range}</p>
                    </div>
                  </div>
                )}
                {c.opening_hours && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Jam Buka</p>
                      <p className="text-sm font-semibold text-gray-900">{c.opening_hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Deskripsi</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{c.description}</p>
              </div>

              {/* Facilities */}
              {facilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Fasilitas</h2>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialties */}
              {specialties.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Menu Spesial</h2>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rating Section */}
        <RatingWidget itemType="culinary" itemId={c.id} />
      </div>
    </div>
  )
}
