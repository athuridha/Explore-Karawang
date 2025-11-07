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
  rating: number
  category: "traditional" | "seafood" | "snack" | "modern"
  googleMapsLink?: string
}

export async function addCulinary(data: CulinaryInput) {
  try {
    const id = crypto.randomUUID()
    await query(
      `INSERT INTO culinary (id, title, description, image, restaurant, location, price_range, opening_hours, specialties, rating, category, google_maps_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.rating,
        data.category,
        data.googleMapsLink || null,
      ]
    )
    const rows = await query<any>("SELECT * FROM culinary WHERE id = ?", [id])
    const normalized = rows.map(r => ({ ...r, specialties: safeParseJson(r.specialties) }))
    return { success: true, data: normalized }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateCulinary(id: string, data: CulinaryInput) {
  try {
    await query(
      `UPDATE culinary
         SET title=?, description=?, image=?, restaurant=?, location=?, price_range=?, opening_hours=?, specialties=?, rating=?, category=?, google_maps_link=?
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
        data.rating,
        data.category,
        data.googleMapsLink || null,
        id,
      ]
    )
    const rows = await query<any>("SELECT * FROM culinary WHERE id = ?", [id])
    const normalized = rows.map(r => ({ ...r, specialties: safeParseJson(r.specialties) }))
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
    const rows = await query<any>("SELECT * FROM culinary ORDER BY created_at DESC")
    const normalized = rows.map(r => ({ ...r, specialties: safeParseJson(r.specialties) }))
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
    return { success: true, data: { ...r, specialties: safeParseJson(r.specialties) } }
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
