"use client"

import * as React from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { addCategory, getCategories } from '@/app/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, RefreshCcw } from 'lucide-react'

interface CategoryRow {
  id: string
  name: string
  slug: string
  type: 'destination' | 'culinary'
  created_at?: string | Date
}

export default function CategoriesAdminPage() {
  const [loading, setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState<CategoryRow[]>([])
  const [activeType, setActiveType] = React.useState<'destination' | 'culinary'>('destination')
  const [newName, setNewName] = React.useState('')
  const [adding, setAdding] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    setError(null)
    const res = await getCategories()
    if (res.success && res.data) {
      setCategories(res.data as CategoryRow[])
    } else {
      setError(res.error || 'Failed to load categories')
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setError(null)
    const existingSame = categories.find(c => c.type === activeType && c.name.toLowerCase() === newName.toLowerCase())
    if (existingSame) {
      setError('Category with that name already exists.')
      setAdding(false)
      return
    }
    const res = await addCategory({ name: newName.trim(), type: activeType })
    if (res.success && res.data) {
      setCategories(prev => [...prev, res.data as CategoryRow])
      setNewName('')
    } else {
      setError(res.error || 'Failed to add category')
    }
    setAdding(false)
  }

  const filtered = categories.filter(c => c.type === activeType).sort((a,b) => a.name.localeCompare(b.name))

  const formatDate = (value?: string | Date) => {
    if (!value) return ''
    try {
      const d = value instanceof Date ? value : new Date(value)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().slice(0, 10)
    } catch {
      return ''
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Categories</h1>
            <p className="text-gray-600">Create and organize destination & restaurant categories</p>
          </div>
          <Button onClick={loadAll} variant="outline" disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Reload
          </Button>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        <Tabs value={activeType} onValueChange={(v) => setActiveType(v as 'destination' | 'culinary')} className="mb-6">
          <TabsList>
            <TabsTrigger value="destination">Destinations</TabsTrigger>
            <TabsTrigger value="culinary">Restaurants</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New {activeType === 'destination' ? 'Destination Category' : 'Restaurant Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={activeType === 'destination' ? 'e.g. Mountains' : 'e.g. Seafood'}
                  disabled={adding}
                />
              </div>
              <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700">
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                {adding ? 'Saving...' : 'Add Category'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{activeType === 'destination' ? 'Destination Categories' : 'Restaurant Categories'} ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <ul className="divide-y text-sm">
                {filtered.map(cat => (
                  <li key={cat.id} className="flex items-center justify-between py-2">
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{cat.slug}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(cat.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
