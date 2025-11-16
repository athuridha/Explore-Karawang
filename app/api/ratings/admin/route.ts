import { NextResponse } from 'next/server'
import { getPool } from '@/lib/mysql'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const [rows] = await getPool().query<RowDataPacket[]>(`
      SELECT 
        r.id,
        r.item_type,
        r.item_id,
        r.rating,
        r.comment,
        r.media,
        r.visible,
        r.device_id,
        r.ip_address,
        r.user_agent,
        r.created_at,
        CASE 
          WHEN r.item_type = 'destination' THEN d.title
          WHEN r.item_type = 'culinary' THEN c.restaurant
        END as item_name
      FROM ratings r
      LEFT JOIN destinations d ON r.item_type = 'destination' AND r.item_id = d.id
      LEFT JOIN culinary c ON r.item_type = 'culinary' AND r.item_id = c.id
      ORDER BY r.created_at DESC
    `)

    const ratings = rows.map((row: any) => ({
      ...row,
      media: row.media ? JSON.parse(row.media) : null
    }))

    return NextResponse.json({ success: true, ratings })
  } catch (error) {
    console.error('Failed to fetch all ratings:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
