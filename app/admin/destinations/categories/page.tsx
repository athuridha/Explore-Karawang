"use client"

import * as React from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { addCategory, getCategories, updateCategory, deleteCategory } from '@/app/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, RefreshCcw, ArrowLeft, Edit2, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'

interface CategoryRow {
  id: string
  name: string
  slug: string
  type: 'destination' | 'culinary'
  created_at?: string | Date
}

export default function DestinationCategoriesPage() {
  const [loading, setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState<CategoryRow[]>([])
  const [newName, setNewName] = React.useState('')
  const [adding, setAdding] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editName, setEditName] = React.useState('')
  const [deleting, setDeleting] = React.useState<string | null>(null)

  React.useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    setError(null)
    const res = await getCategories('destination')
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
    const existingSame = categories.find(c => c.name.toLowerCase() === newName.toLowerCase())
    if (existingSame) {
      setError('Category with that name already exists.')
      setAdding(false)
      return
    }
    const res = await addCategory({ name: newName.trim(), type: 'destination' })
    if (res.success && res.data) {
      setCategories(prev => [...prev, res.data as CategoryRow])
      setNewName('')
    } else {
      setError(res.error || 'Failed to add category')
    }
    setAdding(false)
  }

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return
    setError(null)
    const res = await updateCategory(id, { name: editName.trim() })
    if (res.success && res.data) {
      setCategories(prev => prev.map(c => c.id === id ? res.data as CategoryRow : c))
      setEditingId(null)
      setEditName('')
    } else {
      setError(res.error || 'Failed to update category')
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    setError(null)
    const res = await deleteCategory(id)
    if (res.success) {
      setCategories(prev => prev.filter(c => c.id !== id))
    } else {
      setError(res.error || 'Failed to delete category')
    }
    setDeleting(null)
  }

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
        <div className="mb-8">
          <Link href="/admin/destinations">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Destination Categories</h1>
            <p className="text-gray-600">Create and organize destination categories</p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Mountains, Beaches, Historical Sites"
                  disabled={adding}
                />
              </div>
              <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700">
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                {adding ? 'Saving...' : 'Add'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories ({categories.length})</CardTitle>
            <Button onClick={loadAll} variant="outline" size="sm" disabled={loading}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <ul className="divide-y text-sm">
                {categories.map(cat => (
                  <li key={cat.id} className="flex items-center justify-between py-3">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-9"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleEdit(cat.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null)
                            setEditName('')
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-xs text-gray-500 ml-2">/{cat.slug}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{formatDate(cat.created_at)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(cat.id)
                              setEditName(cat.name)
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleting === cat.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deleting === cat.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
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
