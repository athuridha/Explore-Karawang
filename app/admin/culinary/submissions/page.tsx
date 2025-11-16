'use client'
import { useEffect, useState } from 'react'
import { listOwnerSubmissions, approveSubmission, rejectSubmission } from '@/app/actions/submissions'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UtensilsCrossed, Mail, Phone, MapPin, Tag, Clock, DollarSign, Image as ImageIcon } from 'lucide-react'

export default function CulinarySubmissionsAdminPage() {
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubmissions() {
      const res = await listOwnerSubmissions('pending')
      const allData = res.success && res.data ? res.data : []
      setPending(allData.filter(s => s.item_type === 'culinary'))
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  async function handleApprove(id: string) {
    await approveSubmission(id)
    const res = await listOwnerSubmissions('pending')
    const allData = res.success && res.data ? res.data : []
    setPending(allData.filter(s => s.item_type === 'culinary'))
  }

  async function handleReject(id: string) {
    await rejectSubmission(id, 'Ditolak oleh admin')
    const res = await listOwnerSubmissions('pending')
    const allData = res.success && res.data ? res.data : []
    setPending(allData.filter(s => s.item_type === 'culinary'))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Memuat data...
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }
  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pengajuan Kuliner Pending</h1>
        <p className="text-muted-foreground">Review dan kelola pengajuan tempat kuliner dari pengunjung</p>
      </div>

      {pending.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Tidak ada pengajuan kuliner yang perlu direview
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pending.map(sub => (
            <Card key={sub.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                      {sub.payload.restaurant || sub.payload.title || 'Tanpa Nama'}
                    </CardTitle>
                    {sub.payload.title && sub.payload.title !== sub.payload.restaurant && (
                      <CardDescription className="text-sm font-medium">
                        Menu: {sub.payload.title}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {sub.payload.category || 'Umum'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Image Preview */}
                {sub.payload.image && (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={sub.payload.image} 
                      alt={sub.payload.restaurant} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">Deskripsi:</h4>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {sub.payload.description || '-'}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {sub.payload.location && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{sub.payload.location}</span>
                    </div>
                  )}
                  {sub.payload.priceRange && (
                    <div className="flex items-start gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{sub.payload.priceRange}</span>
                    </div>
                  )}
                  {sub.payload.openingHours && (
                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{sub.payload.openingHours}</span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {sub.payload.specialties && sub.payload.specialties.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Menu Spesial:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sub.payload.specialties.map((spec: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities */}
                {sub.payload.facilities && sub.payload.facilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Fasilitas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sub.payload.facilities.map((fac: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {fac}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submitter Info */}
                <div className="border-t pt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Informasi Pengaju:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">👤</span>
                      {sub.submitter_name}
                    </div>
                    {sub.submitter_email && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-3 w-3" />
                        {sub.submitter_email}
                      </div>
                    )}
                    {sub.submitter_phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-3 w-3" />
                        {sub.submitter_phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={() => handleApprove(sub.id)} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✓ Setujui
                  </Button>
                  <Button 
                    onClick={() => handleReject(sub.id)} 
                    variant="destructive" 
                    className="flex-1"
                  >
                    ✕ Tolak
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </AdminLayout>
  )
}
