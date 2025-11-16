"use server"

import { query } from "@/lib/mysql"
import crypto from "node:crypto"
import { CreateSubmissionInput, OwnerSubmission } from "@/types"

function serializePayload(input: CreateSubmissionInput) {
  const payload = { ...input }
  return JSON.stringify(payload)
}

export async function createOwnerSubmission(input: CreateSubmissionInput) {
  try {
    const id = crypto.randomUUID()
    await query(
      `INSERT INTO owner_submissions (id, submitter_name, submitter_email, submitter_phone, item_type, payload, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id,
        input.submitter_name,
        input.submitter_email || null,
        input.submitter_phone || null,
        input.item_type,
        serializePayload(input),
      ]
    )
    return { success: true, id }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function listOwnerSubmissions(status: 'pending' | 'approved' | 'rejected' = 'pending') {
  try {
    const rows = await query<any>("SELECT * FROM owner_submissions WHERE status = ? ORDER BY created_at DESC", [status])
    const mapped: OwnerSubmission[] = rows.map(r => ({ ...r, payload: safeParse(r.payload) }))
    return { success: true, data: mapped }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function approveSubmission(id: string, adminNotes?: string) {
  try {
    const rows = await query<any>("SELECT * FROM owner_submissions WHERE id=? LIMIT 1", [id])
    if (rows.length === 0) return { success: false, error: "Submission not found" }
    const submission = rows[0]
    const data = safeParse(submission.payload)
    // Insert into appropriate table
    const newId = crypto.randomUUID()
    if (submission.item_type === 'destination') {
      await query(
        `INSERT INTO destinations (id,title,description,image,location,category,facilities,best_time_to_visit,entrance_fee,rating,google_maps_link,category_id)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          newId,
          data.title,
          data.description,
          data.image || null,
          data.location,
          data.category || 'general',
          JSON.stringify(data.facilities || []),
          data.bestTimeToVisit || null,
          data.entranceFee || null,
          4.5,
          data.googleMapsLink || null,
          null,
        ]
      )
    } else {
      await query(
        `INSERT INTO culinary (id,title,description,image,restaurant,location,price_range,opening_hours,specialties,rating,category,google_maps_link,category_id,facilities)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          newId,
          data.title,
          data.description,
          data.image || null,
          data.restaurant || data.title,
          data.location,
          data.priceRange || null,
          data.openingHours || null,
          JSON.stringify(data.specialties || []),
          4.5,
          data.category || 'general',
          data.googleMapsLink || null,
          null,
          JSON.stringify(data.facilities || []),
        ]
      )
    }
    await query(
      `UPDATE owner_submissions SET status='approved', admin_notes=?, approved_at=NOW(), updated_at=NOW() WHERE id=?`,
      [adminNotes || null, id]
    )
    return { success: true, newId }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function rejectSubmission(id: string, adminNotes?: string) {
  try {
    await query(
      `UPDATE owner_submissions SET status='rejected', admin_notes=?, updated_at=NOW() WHERE id=?`,
      [adminNotes || null, id]
    )
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

function safeParse(v: any) {
  if (typeof v === 'string') {
    try { return JSON.parse(v) } catch { return {} }
  }
  return v || {}
}
