"use client"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategories } from "@/app/actions/categories"
import { getFacilityPresets } from "@/app/actions/facilities"
import { ImageUploadInput } from "@/components/image-upload-input"

export default function SubmitDestinationPage() {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([])
  const [availableFacilities, setAvailableFacilities] = React.useState<string[]>([])
  const [formData, setFormData] = React.useState({
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    title: '',
    description: '',
    location: '',
    image: '',
    category: '',
    googleMapsLink: '',
    facilities: [] as string[],
    bestTimeToVisit: '',
    entranceFee: ''
  })

  React.useEffect(() => {
    const loadData = async () => {
      const [catRes, facRes] = await Promise.all([
        getCategories('destination'),
        getFacilityPresets('destination')
      ])
      if (catRes.success && catRes.data) {
        setCategories(catRes.data.map((c: any) => ({ id: c.id, name: c.name })))
        setFormData(prev => ({ ...prev, category: catRes.data[0]?.name || '' }))
      }
      if (facRes.success && facRes.data) {
        setAvailableFacilities(facRes.data.map((f: any) => f.name))
      }
    }
    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const payload = {
      ...formData,
      item_type: 'destination'
    }
    const res = await fetch('/api/submissions', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    const json = await res.json()
    if (json.success) {
      setFormData({
        submitter_name: '',
        submitter_email: '',
        submitter_phone: '',
        title: '',
        description: '',
        location: '',
        image: '',
        category: categories[0]?.name || '',
        googleMapsLink: '',
        facilities: [],
        bestTimeToVisit: '',
        entranceFee: ''
      })
      setMessage('✅ Berhasil dikirim! Menunggu persetujuan admin.')
    } else {
      setMessage('❌ Gagal: ' + json.error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ajukan Destinasi Wisata Baru</h1>
        <p className="text-muted-foreground">Bantu kami melengkapi destinasi wisata di Karawang dengan mengisi form berikut. Admin akan meninjau pengajuan Anda sebelum ditampilkan ke publik.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengaju</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Anda *</label>
                    <Input name="submitter_name" value={formData.submitter_name} onChange={handleInputChange} required placeholder="Nama lengkap" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input name="submitter_email" type="email" value={formData.submitter_email} onChange={handleInputChange} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">No. Telepon</label>
                    <Input name="submitter_phone" value={formData.submitter_phone} onChange={handleInputChange} placeholder="08xx xxxx xxxx" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Informasi Destinasi</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nama Destinasi *</label>
                        <Input name="title" value={formData.title} onChange={handleInputChange} required placeholder="Contoh: Pantai Tanjung Pakis" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Lokasi *</label>
                        <Input name="location" value={formData.location} onChange={handleInputChange} required placeholder="Contoh: Tanjung Pakis, Karawang" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Deskripsi *</label>
                      <Textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="Ceritakan tentang destinasi ini..." rows={4} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Kategori</label>
                        <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <ImageUploadInput label="Foto Destinasi" value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} placeholder="Upload atau paste URL" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Link Google Maps</label>
                      <Input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Waktu Kunjungan Terbaik</label>
                        <Input name="bestTimeToVisit" value={formData.bestTimeToVisit} onChange={handleInputChange} placeholder="Contoh: Pagi hari" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Biaya Masuk</label>
                        <Input name="entranceFee" value={formData.entranceFee} onChange={handleInputChange} placeholder="Contoh: Rp 10.000" />
                      </div>
                    </div>

                    {availableFacilities.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-3">Fasilitas yang Tersedia</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
                          {availableFacilities.map((facility) => (
                            <label key={facility} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                              <input type="checkbox" checked={formData.facilities.includes(facility)} onChange={() => handleFacilityToggle(facility)} className="w-4 h-4" />
                              <span className="text-sm">{facility}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? 'Mengirim...' : '📮 Kirim Pengajuan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card className="xl:sticky xl:top-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <p className="text-sm text-gray-500">Tampilan destinasi Anda</p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-48 w-full bg-gray-200">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Belum ada gambar</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{formData.title || 'Nama Destinasi'}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">📍 {formData.location || 'Lokasi'}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{formData.description || 'Deskripsi destinasi...'}</p>
                  {formData.facilities.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-2">Fasilitas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.facilities.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
