import { getDestinationById } from '@/app/actions/destinations'
import { RatingWidget } from '@/components/rating-widget'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

interface Params { params: { id: string } }

export default async function DestinationDetailPage({ params }: Params) {
  const res = await getDestinationById(params.id)
  if (!res.success || !res.data) return notFound()
  const d = res.data
  
  const facilities = d.facilities 
    ? (Array.isArray(d.facilities) ? d.facilities : (typeof d.facilities === 'string' ? d.facilities.split(',').map((f: string) => f.trim()) : []))
    : []
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Hero Image */}
        {d.image && (
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img 
              src={d.image} 
              alt={d.title} 
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
                {d.category && (
                  <Badge className="mb-3">{d.category}</Badge>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{d.title}</h1>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium">{d.location}</p>
                  {d.google_maps_link && (
                    <a 
                      href={d.google_maps_link} 
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

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Deskripsi</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{d.description}</p>
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
            </div>
          </CardContent>
        </Card>

        {/* Rating Section */}
        <RatingWidget itemType="destination" itemId={d.id} />
      </div>
    </div>
  )
}
