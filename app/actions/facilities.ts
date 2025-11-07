"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"

export interface FacilityPreset {
  id: string
  type: 'destination' | 'culinary'
  name: string
  icon_name?: string
}

export async function getFacilityPresets(type: 'destination' | 'culinary') {
  try {
    const rows = await query<FacilityPreset>(
      `SELECT * FROM facility_presets WHERE type = ? ORDER BY name ASC`,
      [type]
    )
    return { success: true, data: rows }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function addFacilityPreset(data: { type: 'destination' | 'culinary'; name: string; icon_name?: string }) {
  try {
    const id = crypto.randomUUID()
    await query(
      `INSERT INTO facility_presets (id, type, name, icon_name) VALUES (?, ?, ?, ?)`,
      [id, data.type, data.name, data.icon_name || null]
    )
    const rows = await query<FacilityPreset>(
      `SELECT * FROM facility_presets WHERE id = ? LIMIT 1`,
      [id]
    )
    return { success: true, data: rows[0] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteFacilityPreset(id: string) {
  try {
    await query(`DELETE FROM facility_presets WHERE id = ?`, [id])
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
