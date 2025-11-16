"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface RatingWidgetProps {
  itemType: 'destination' | 'culinary'
  itemId: string
}

interface Rating {
  id: string
  rating: number
  comment?: string
  media?: string[]
  created_at: string
  device_id: string
}

export function RatingWidget({ itemType, itemId }: RatingWidgetProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaList, setMediaList] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [average, setAverage] = useState<{ avg_rating: number | null; total: number }>({ avg_rating: null, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchRatings() {
    const res = await fetch(`/api/ratings?item_type=${itemType}&item_id=${itemId}`)
    const json = await res.json()
    if (json.success) {
      setRatings(json.ratings || [])
      setAverage(json.summary || { avg_rating: null, total: 0 })
    }
  }

  useEffect(() => { fetchRatings() }, [itemType, itemId])

  const addMedia = () => {
    if (mediaUrl.trim() && !mediaList.includes(mediaUrl.trim())) {
      setMediaList([...mediaList, mediaUrl.trim()])
      setMediaUrl('')
    }
  }

  const removeMedia = (url: string) => {
    setMediaList(mediaList.filter(m => m !== url))
  }

  async function handleSubmit() {
    if (rating === 0) {
      setError('Pilih rating terlebih dahulu')
      return
    }
    setLoading(true)
    setError(null)
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        item_type: itemType, 
        item_id: itemId, 
        rating, 
        comment: comment.trim() || undefined,
        media: mediaList.length > 0 ? mediaList : undefined
      })
    })
    const json = await res.json()
    if (!json.success) {
      setError(json.error || 'Gagal mengirim rating')
    } else {
      setSubmitted(true)
      setRating(0)
      setComment('')
      setMediaList([])
      fetchRatings()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rating & Ulasan</CardTitle>
          {average.avg_rating !== null && (
            <p className="text-sm text-muted-foreground">
              Rata-rata: <span className="font-semibold text-yellow-600">{average.avg_rating}</span> dari {average.total} ulasan
            </p>
          )}
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              Terima kasih! Rating Anda telah dikirim dan sedang ditinjau.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Berikan Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button 
                      key={n} 
                      type="button" 
                      onClick={() => setRating(n)} 
                      className={`w-12 h-12 rounded border-2 font-semibold transition-all ${
                        rating >= n 
                          ? 'bg-yellow-400 border-yellow-500 text-yellow-900' 
                          : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Komentar (Opsional)</label>
                <Textarea 
                  value={comment} 
                  onChange={e => setComment(e.target.value)} 
                  placeholder="Bagikan pengalaman Anda di sini..." 
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tambah Media (Opsional)</label>
                <div className="flex gap-2">
                  <Input 
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="URL gambar atau video"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMedia())}
                  />
                  <Button type="button" onClick={addMedia} variant="outline">Tambah</Button>
                </div>
                {mediaList.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {mediaList.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                        <span className="flex-1 truncate">{url}</span>
                        <button type="button" onClick={() => removeMedia(url)} className="text-red-600 hover:text-red-800">
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={loading || rating === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Mengirim...' : 'Kirim Rating'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Setiap perangkat hanya dapat memberikan satu rating per tempat
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {ratings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ulasan Pengunjung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratings.map(r => (
              <div key={r.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={n <= r.rating ? 'text-yellow-500' : 'text-gray-300'}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-700 mb-2">{r.comment}</p>
                )}
                {r.media && r.media.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {r.media.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Review media" 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
