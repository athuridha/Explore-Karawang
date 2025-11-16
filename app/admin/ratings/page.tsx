"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminLayout } from '@/components/admin/admin-layout'

interface Rating {
  id: string
  item_type: 'destination' | 'culinary'
  item_id: string
  item_name?: string
  rating: number
  comment?: string
  media?: string[]
  visible: boolean
  device_id: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [filter, setFilter] = useState<'all' | 'destination' | 'culinary'>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function fetchRatings() {
    setLoading(true)
    try {
      const res = await fetch('/api/ratings/admin')
      const json = await res.json()
      if (json.success) {
        setRatings(json.ratings || [])
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
    }
    setLoading(false)
  }

  useEffect(() => { fetchRatings() }, [])

  async function toggleVisibility(id: string, currentVisible: boolean) {
    const res = await fetch(`/api/ratings/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const json = await res.json()
    if (json.success) {
      fetchRatings()
    }
  }

  async function deleteRating(id: string, itemName: string) {
    if (!confirm(`Yakin ingin menghapus rating untuk "${itemName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }
    
    const res = await fetch(`/api/ratings/${id}/delete`, {
      method: 'DELETE'
    })
    const json = await res.json()
    if (json.success) {
      fetchRatings()
    } else {
      alert('Gagal menghapus rating: ' + (json.error || 'Unknown error'))
    }
  }

  const filteredRatings = ratings.filter(r => {
    if (filter !== 'all' && r.item_type !== filter) return false
    if (visibilityFilter === 'visible' && !r.visible) return false
    if (visibilityFilter === 'hidden' && r.visible) return false
    if (search && !r.item_name?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Rating</h1>
          <p className="text-muted-foreground">Kelola semua rating dan ulasan pengunjung</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Jenis</label>
              <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="destination">Destinasi Wisata</SelectItem>
                  <SelectItem value="culinary">Kuliner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Visibilitas</label>
              <Select value={visibilityFilter} onValueChange={(v: any) => setVisibilityFilter(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="visible">Ditampilkan</SelectItem>
                  <SelectItem value="hidden">Disembunyikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Cari Tempat</label>
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Nama destinasi atau kuliner..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Memuat data rating...
          </CardContent>
        </Card>
      ) : filteredRatings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Tidak ada rating ditemukan
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRatings.map(rating => (
            <Card key={rating.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={rating.item_type === 'destination' ? 'default' : 'secondary'}>
                        {rating.item_type === 'destination' ? 'Destinasi' : 'Kuliner'}
                      </Badge>
                      <h3 className="font-semibold text-lg">{rating.item_name || `ID: ${rating.item_id}`}</h3>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(n => (
                          <span key={n} className={`text-lg ${n <= rating.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                            &#9733;
                          </span>
                        ))}
                        <span className="ml-2 font-semibold">{rating.rating}/5</span>
                      </div>
                    </div>

                    {rating.comment && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{rating.comment}</p>
                      </div>
                    )}

                    {rating.media && rating.media.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {rating.media.map((url, idx) => (
                          <img 
                            key={idx} 
                            src={url} 
                            alt="Rating media" 
                            className="w-24 h-24 object-cover rounded border"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="border-t pt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Device ID:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded">{rating.device_id}</code>
                      </div>
                      {rating.ip_address && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">IP Address:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded">{rating.ip_address}</code>
                        </div>
                      )}
                      {rating.user_agent && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">User Agent:</span>
                          <span className="text-xs truncate max-w-md">{rating.user_agent}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tanggal:</span>
                        <span>
                          {new Date(rating.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 space-y-2">
                    <Button
                      onClick={() => toggleVisibility(rating.id, rating.visible)}
                      variant={rating.visible ? 'destructive' : 'default'}
                      size="sm"
                      className="w-full"
                    >
                      {rating.visible ? 'Sembunyikan' : 'Tampilkan'}
                    </Button>
                    <Button
                      onClick={() => deleteRating(rating.id, rating.item_name || `ID: ${rating.item_id}`)}
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Hapus
                    </Button>
                    <Badge 
                      variant={rating.visible ? 'default' : 'secondary'}
                      className="block text-center"
                    >
                      {rating.visible ? 'Ditampilkan' : 'Disembunyikan'}
                    </Badge>
                  </div>
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
