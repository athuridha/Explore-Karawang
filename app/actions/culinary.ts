"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"

export interface CulinaryInput {
  title: string
  description: string
  image: string
  restaurant: string
  location: string
  priceRange: string
  openingHours: string
  specialties: string[]
  category: string // dynamic
  googleMapsLink?: string
  categoryId?: string
  facilities?: string[]
}

export async function addCulinary(data: CulinaryInput) {
  try {
    const id = crypto.randomUUID()
    await query(
      `INSERT INTO culinary (id, title, description, image, restaurant, location, price_range, opening_hours, specialties, category, google_maps_link, category_id, facilities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.description,
        data.image,
        data.restaurant,
        data.location,
        data.priceRange,
        data.openingHours,
        JSON.stringify(data.specialties ?? []),
        data.category,
        data.googleMapsLink || null,
        data.categoryId || null,
        JSON.stringify(data.facilities ?? []),
      ]
    )
    const rows = await query<any>("SELECT * FROM culinary WHERE id = ?", [id])
    const normalized = rows.map(r => ({ ...r, specialties: safeParseJson(r.specialties), facilities: safeParseJson(r.facilities) }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateCulinary(id: string, data: CulinaryInput) {
  try {
    await query(
      `UPDATE culinary
         SET title=?, description=?, image=?, restaurant=?, location=?, price_range=?, opening_hours=?, specialties=?, category=?, google_maps_link=?, category_id=?, facilities=?
       WHERE id=?`,
      [
        data.title,
        data.description,
        data.image,
        data.restaurant,
        data.location,
        data.priceRange,
        data.openingHours,
        JSON.stringify(data.specialties ?? []),
        data.category,
        data.googleMapsLink || null,
        data.categoryId || null,
        JSON.stringify(data.facilities ?? []),
        id,
      ]
    )
    const rows = await query<any>("SELECT * FROM culinary WHERE id = ?", [id])
    const normalized = rows.map(r => ({ ...r, specialties: safeParseJson(r.specialties), facilities: safeParseJson(r.facilities) }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteCulinary(id: string) {
  try {
    await query("DELETE FROM culinary WHERE id = ?", [id])
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getCulinaryItems() {
  try {
    const rows = await query<any>(`
      SELECT c.*, 
        COALESCE(r.avg_rating, 0) as avg_rating,
        COALESCE(r.ratings_count, 0) as ratings_count
      FROM culinary c
      LEFT JOIN (
        SELECT item_id, 
          ROUND(AVG(rating), 2) as avg_rating,
          COUNT(*) as ratings_count
        FROM ratings 
        WHERE item_type = 'culinary' AND visible = TRUE
        GROUP BY item_id
      ) r ON c.id = r.item_id
      ORDER BY c.created_at DESC
    `)
    const normalized = rows.map(r => ({ 
      ...r, 
      specialties: safeParseJson(r.specialties), 
      facilities: safeParseJson(r.facilities),
      avg_rating: Number(r.avg_rating) || 0,
      ratings_count: Number(r.ratings_count) || 0,
    }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getCulinaryById(id: string) {
  try {
    const rows = await query<any>("SELECT * FROM culinary WHERE id = ? LIMIT 1", [id])
    if (rows.length === 0) return { success: true, data: null }
    const r = rows[0]
    return { success: true, data: { ...r, specialties: safeParseJson(r.specialties), facilities: safeParseJson(r.facilities) } }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

function safeParseJson(value: any) {
  if (value == null) return []
  if (typeof value === "string") {
    try { return JSON.parse(value) } catch { return [] }
  }
  return value
}
