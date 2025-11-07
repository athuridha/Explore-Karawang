"use client"

import * as React from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { getFacilityPresets, addFacilityPreset, deleteFacilityPreset } from '@/app/actions/facilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, Trash2, RefreshCcw } from 'lucide-react'

interface FacilityRow {
  id: string
  name: string
  type: 'destination' | 'culinary'
  icon_name?: string
}

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(true)
  const [facilities, setFacilities] = React.useState<FacilityRow[]>([])
  const [activeType, setActiveType] = React.useState<'destination' | 'culinary'>('destination')
  const [newName, setNewName] = React.useState('')
  const [adding, setAdding] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState<string | null>(null)

  React.useEffect(() => {
    loadAll()
  }, [activeType])

  const loadAll = async () => {
    setLoading(true)
    setError(null)
    const res = await getFacilityPresets(activeType)
    if (res.success && res.data) {
      setFacilities(res.data)
    } else {
      setError(res.error || 'Failed to load facilities')
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setError(null)
    const existingSame = facilities.find(f => f.name.toLowerCase() === newName.toLowerCase())
    if (existingSame) {
      setError('Facility with that name already exists.')
      setAdding(false)
      return
    }
    const res = await addFacilityPreset({ type: activeType, name: newName.trim() })
    if (res.success && res.data) {
      setFacilities(prev => [...prev, res.data as FacilityRow])
      setNewName('')
    } else {
      setError(res.error || 'Failed to add facility')
    }
    setAdding(false)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    setError(null)
    const res = await deleteFacilityPreset(id)
    if (res.success) {
      setFacilities(prev => prev.filter(f => f.id !== id))
    } else {
      setError(res.error || 'Failed to delete facility')
    }
    setDeleting(null)
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage facilities and presets for destinations and restaurants</p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        <Tabs value={activeType} onValueChange={(v) => setActiveType(v as 'destination' | 'culinary')} className="mb-6">
          <TabsList>
            <TabsTrigger value="destination">Destination Facilities</TabsTrigger>
            <TabsTrigger value="culinary">Restaurant Facilities</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New {activeType === 'destination' ? 'Destination' : 'Restaurant'} Facility</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-2">Facility Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={activeType === 'destination' ? 'e.g. Parking, WiFi, Hiking Trails' : 'e.g. WiFi, Parking, Reservations'}
                  disabled={adding}
                />
              </div>
              <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700">
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                {adding ? 'Saving...' : 'Add Facility'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{activeType === 'destination' ? 'Destination' : 'Restaurant'} Facilities ({facilities.length})</CardTitle>
            <Button onClick={loadAll} variant="outline" size="sm" disabled={loading}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : facilities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No facilities yet. Add one to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {facilities.map(facility => (
                  <div key={facility.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{facility.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(facility.id)}
                      disabled={deleting === facility.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleting === facility.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
