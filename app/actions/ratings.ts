"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"
import { CreateRatingInput, RatingRecord } from "@/types"

export async function addRating(input: CreateRatingInput, deviceId: string, ip?: string, ua?: string) {
  try {
    const id = crypto.randomUUID()
    // Check existing
    const existing = await query<any>(
      `SELECT id FROM ratings WHERE item_type=? AND item_id=? AND device_id=? LIMIT 1`,
      [input.item_type, input.item_id, deviceId]
    )
    if (existing.length > 0) {
      return { success: false, error: 'Device already rated this item' }
    }
    await query(
      `INSERT INTO ratings (id,item_type,item_id,device_id,ip_address,user_agent,rating,comment,media,visible)
       VALUES (?,?,?,?,?,?,?,?,?,TRUE)`,
      [
        id,
        input.item_type,
        input.item_id,
        deviceId,
        ip || null,
        ua || null,
        input.rating,
        input.comment || null,
        JSON.stringify(input.media || []),
      ]
    )
    return { success: true, id }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function listRatings(itemType: 'destination' | 'culinary', itemId: string, includeHidden = false) {
  try {
    const sql = includeHidden ?
      `SELECT * FROM ratings WHERE item_type=? AND item_id=? ORDER BY created_at DESC` :
      `SELECT * FROM ratings WHERE item_type=? AND item_id=? AND visible=TRUE ORDER BY created_at DESC`
    const rows = await query<any>(sql, [itemType, itemId])
    const mapped: RatingRecord[] = rows.map(r => ({ ...r, media: safeParse(r.media) }))
    return { success: true, data: mapped }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function toggleRatingVisibility(id: string, visible: boolean) {
  try {
    await query(`UPDATE ratings SET visible=? WHERE id=?`, [visible ? 1 : 0, id])
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function getAverageRating(itemType: 'destination' | 'culinary', itemId: string) {
  try {
    const rows = await query<any>(
      `SELECT ROUND(AVG(rating),2) AS avg_rating, COUNT(*) AS total
       FROM ratings WHERE item_type=? AND item_id=? AND visible=TRUE`,
      [itemType, itemId]
    )
    const r = rows[0] || { avg_rating: null, total: 0 }
    return { success: true, data: r }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

function safeParse(v: any) {
  if (typeof v === 'string') {
    try { return JSON.parse(v) } catch { return [] }
  }
  return v || []
}
