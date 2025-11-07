"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"
import type { Category } from "@/types"

export interface AddCategoryInput {
  name: string
  type: 'destination' | 'culinary'
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function addCategory(data: AddCategoryInput) {
  try {
    const id = crypto.randomUUID()
    const slug = slugify(data.name)
    await query(
      `INSERT INTO categories (id, name, slug, type) VALUES (?, ?, ?, ?)`,
      [id, data.name, slug, data.type]
    )
    const rows = await query<Category>(`SELECT * FROM categories WHERE id = ? LIMIT 1`, [id])
    return { success: true, data: rows[0] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getCategories(type?: 'destination' | 'culinary') {
  try {
    let rows: any[] = []
    if (type) {
      rows = await query<Category>(`SELECT * FROM categories WHERE type = ? ORDER BY name ASC`, [type])
    } else {
      rows = await query<Category>(`SELECT * FROM categories ORDER BY type, name ASC`)
    }
    return { success: true, data: rows }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function ensureSeedCategories() {
  // If no categories exist, seed basic ones from existing data (fallback migration helper)
  try {
    const existing = await query<any>(`SELECT COUNT(*) as cnt FROM categories`)
    if (existing[0]?.cnt > 0) return { success: true, seeded: false }

    const destDistinct = await query<any>(`SELECT DISTINCT category FROM destinations WHERE category <> ''`)
    const culDistinct = await query<any>(`SELECT DISTINCT category FROM culinary WHERE category <> ''`)

    for (const row of destDistinct) {
      if (!row.category) continue
      await addCategory({ name: row.category, type: 'destination' })
    }
    for (const row of culDistinct) {
      if (!row.category) continue
      await addCategory({ name: row.category, type: 'culinary' })
    }
    return { success: true, seeded: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getCategoryCounts(type: 'destination' | 'culinary') {
  try {
    // Use LEFT JOIN so categories with zero items still appear
    const table = type === 'destination' ? 'destinations' : 'culinary'
    const rows = await query<any>(
      `SELECT c.id, c.name, c.slug, c.type, COUNT(t.id) as item_count
       FROM categories c
       LEFT JOIN ${table} t ON (t.category = c.name)
       WHERE c.type = ?
       GROUP BY c.id, c.name, c.slug, c.type
       ORDER BY c.name ASC`,
      [type]
    )
    return { success: true, data: rows }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateCategory(id: string, data: { name?: string }) {
  try {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'Category name cannot be empty' }
    }
    const slug = slugify(data.name)
    await query(
      `UPDATE categories SET name = ?, slug = ? WHERE id = ?`,
      [data.name.trim(), slug, id]
    )
    const rows = await query<Category>(`SELECT * FROM categories WHERE id = ? LIMIT 1`, [id])
    return { success: true, data: rows[0] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Get category first to check if it exists
    const rows = await query<Category>(`SELECT * FROM categories WHERE id = ? LIMIT 1`, [id])
    if (!rows || rows.length === 0) {
      return { success: false, error: 'Category not found' }
    }
    const category = rows[0]
    
    // Delete the category
    await query(`DELETE FROM categories WHERE id = ?`, [id])
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
