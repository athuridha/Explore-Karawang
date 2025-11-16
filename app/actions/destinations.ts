"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"

export interface DestinationInput {
  title: string
  description: string
  image: string
  location: string
  category: string // dynamic category name
  facilities: string[]
  bestTimeToVisit: string
  entranceFee: string
  googleMapsLink?: string
  categoryId?: string // optional reference to categories table
}

export async function addDestination(data: DestinationInput) {
  try {
    const id = crypto.randomUUID()
    await query(
      `INSERT INTO destinations (id, title, description, image, location, category, facilities, best_time_to_visit, entrance_fee, google_maps_link, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.description,
        data.image,
        data.location,
        data.category,
        JSON.stringify(data.facilities ?? []),
        data.bestTimeToVisit,
        data.entranceFee,
        data.googleMapsLink || null,
        data.categoryId || null,
      ]
    )
    const rows = await query<any>("SELECT * FROM destinations WHERE id = ?", [id])
    const normalized = rows.map(r => ({
      ...r,
      facilities: safeParseJson(r.facilities),
    }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateDestination(id: string, data: DestinationInput) {
  try {
    await query(
      `UPDATE destinations
         SET title=?, description=?, image=?, location=?, category=?, facilities=?, best_time_to_visit=?, entrance_fee=?, google_maps_link=?, category_id=?
       WHERE id=?`,
      [
        data.title,
        data.description,
        data.image,
        data.location,
        data.category,
        JSON.stringify(data.facilities ?? []),
        data.bestTimeToVisit,
        data.entranceFee,
        data.googleMapsLink || null,
        data.categoryId || null,
        id,
      ]
    )
    const rows = await query<any>("SELECT * FROM destinations WHERE id = ?", [id])
    const normalized = rows.map(r => ({
      ...r,
      facilities: safeParseJson(r.facilities),
    }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteDestination(id: string) {
  try {
    await query("DELETE FROM destinations WHERE id = ?", [id])
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getDestinations() {
  try {
    const rows = await query<any>(`
      SELECT d.*, 
        COALESCE(r.avg_rating, 0) as avg_rating,
        COALESCE(r.ratings_count, 0) as ratings_count
      FROM destinations d
      LEFT JOIN (
        SELECT item_id, 
          ROUND(AVG(rating), 2) as avg_rating,
          COUNT(*) as ratings_count
        FROM ratings 
        WHERE item_type = 'destination' AND visible = TRUE
        GROUP BY item_id
      ) r ON d.id = r.item_id
      ORDER BY d.created_at DESC
    `)
    const normalized = rows.map(r => ({
      ...r,
      facilities: safeParseJson(r.facilities),
      avg_rating: Number(r.avg_rating) || 0,
      ratings_count: Number(r.ratings_count) || 0,
    }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getDestinationById(id: string) {
  try {
    const rows = await query<any>("SELECT * FROM destinations WHERE id = ? LIMIT 1", [id])
    if (rows.length === 0) return { success: true, data: null }
    const r = rows[0]
    return { success: true, data: { ...r, facilities: safeParseJson(r.facilities) } }
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
