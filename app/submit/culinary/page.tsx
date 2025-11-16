"use client"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { getCategories } from "@/app/actions/categories"
import { getFacilityPresets } from "@/app/actions/facilities"
import { ImageUploadInput } from "@/components/image-upload-input"

export default function SubmitCulinaryPage() {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([])
  const [availableFacilities, setAvailableFacilities] = React.useState<string[]>([])
  const [priceMin, setPriceMin] = React.useState(10000)
  const [priceMax, setPriceMax] = React.useState(200000)
  const [openHour, setOpenHour] = React.useState(8)
  const [closeHour, setCloseHour] = React.useState(22)
  const [formData, setFormData] = React.useState({
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    title: '',
    restaurant: '',
    description: '',
    location: '',
    image: '',
    category: '',
    priceRange: '',
    openingHours: '',
    googleMapsLink: '',
    specialties: [] as string[],
    facilities: [] as string[]
  })
  const [specialtiesInput, setSpecialtiesInput] = React.useState('')

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
  }

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:00 ${period}`
  }

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      priceRange: `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`,
      openingHours: `Daily, ${formatTime(openHour)} - ${formatTime(closeHour)}`
    }))
  }, [priceMin, priceMax, openHour, closeHour])

  React.useEffect(() => {
    const loadData = async () => {
      const [catRes, facRes] = await Promise.all([
        getCategories('culinary'),
        getFacilityPresets('culinary')
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
    const specialties = specialtiesInput.split(',').map(s => s.trim()).filter(Boolean)
    const payload = {
      ...formData,
      specialties,
      item_type: 'culinary'
    }
    const res = await fetch('/api/submissions', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    const json = await res.json()
    if (json.success) {
      setFormData({
        submitter_name: '',
        submitter_email: '',
        submitter_phone: '',
        title: '',
        restaurant: '',
        description: '',
        location: '',
        image: '',
        category: categories[0]?.name || '',
        priceRange: '',
        openingHours: '',
        googleMapsLink: '',
        specialties: [],
        facilities: []
      })
      setSpecialtiesInput('')
      setMessage('✅ Berhasil dikirim! Menunggu persetujuan admin.')
    } else {
      setMessage('❌ Gagal: ' + json.error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ajukan Tempat Kuliner Baru</h1>
        <p className="text-muted-foreground">Bantu kami melengkapi referensi kuliner di Karawang dengan mengisi form berikut. Admin akan meninjau pengajuan Anda sebelum ditampilkan ke publik.</p>
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
                  <h3 className="text-lg font-semibold mb-4">Informasi Tempat Kuliner</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nama Restoran / Warung *</label>
                      <Input name="restaurant" value={formData.restaurant} onChange={handleInputChange} required placeholder="Contoh: Warung Nasi Jamblang Ibu Nur" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Nama Menu / Hidangan</label>
                      <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Nasi Jamblang Komplit" />
                      <p className="text-xs text-gray-500 mt-1">Opsional: nama spesifik menu unggulan</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Deskripsi *</label>
                      <Textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="Ceritakan tentang tempat ini, makanannya, suasananya..." rows={4} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Lokasi *</label>
                        <Input name="location" value={formData.location} onChange={handleInputChange} required placeholder="Contoh: Jl. Tuparev, Karawang" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Kategori</label>
                        <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <ImageUploadInput label="Foto Makanan / Tempat" value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} placeholder="Upload atau paste URL foto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rentang Harga</label>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Min: {formatPrice(priceMin)}</span>
                              <span className="text-muted-foreground">Max: {formatPrice(priceMax)}</span>
                            </div>
                            <Slider
                              min={5000}
                              max={1000000}
                              step={5000}
                              value={[priceMin, priceMax]}
                              onValueChange={([min, max]) => {
                                setPriceMin(min)
                                setPriceMax(max)
                              }}
                              className="w-full"
                            />
                          </div>
                          <div className="text-sm font-medium text-emerald-700 bg-emerald-50 p-2 rounded">
                            {formData.priceRange || 'Set price range'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Jam Operasional</label>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Buka: {formatTime(openHour)}</span>
                              <span className="text-muted-foreground">Tutup: {formatTime(closeHour)}</span>
                            </div>
                            <Slider
                              min={0}
                              max={23}
                              step={1}
                              value={[openHour, closeHour]}
                              onValueChange={([open, close]) => {
                                setOpenHour(open)
                                setCloseHour(close)
                              }}
                              className="w-full"
                            />
                          </div>
                          <div className="text-sm font-medium text-blue-700 bg-blue-50 p-2 rounded">
                            {formData.openingHours || 'Set opening hours'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Link Google Maps</label>
                      <Input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Menu Spesial (pisahkan dengan koma)</label>
                      <Textarea value={specialtiesInput} onChange={(e) => setSpecialtiesInput(e.target.value)} placeholder="Contoh: Nasi Jamblang, Ayam Goreng, Ikan Asin" rows={2} />
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
              <p className="text-sm text-gray-500">Tampilan kuliner Anda</p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-48 w-full bg-gray-200">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Belum ada gambar</div>
                  )}
                  {formData.category && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white rounded-full px-2 py-1 text-xs font-medium capitalize">{formData.category}</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{formData.restaurant || 'Nama Restoran'}</h3>
                  {formData.title && <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">🍴 {formData.title}</p>}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{formData.description || 'Deskripsi tempat kuliner...'}</p>
                  <div className="space-y-1 text-sm">
                    {formData.location && <div className="flex items-center gap-2"><span>📍</span><span>{formData.location}</span></div>}
                    {formData.openingHours && <div className="flex items-center gap-2"><span>🕐</span><span>{formData.openingHours}</span></div>}
                    {formData.priceRange && <div className="flex items-center gap-2"><span>💰</span><span>{formData.priceRange}</span></div>}
                    {specialtiesInput && <div className="flex items-center gap-2"><span>🔥</span><span className="line-clamp-1">{specialtiesInput}</span></div>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
