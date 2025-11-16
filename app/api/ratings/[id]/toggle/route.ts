import { NextResponse } from 'next/server'
import { getPool } from '@/lib/mysql'
import { RowDataPacket } from 'mysql2'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get current visibility
    const [rows] = await getPool().query<RowDataPacket[]>(
      'SELECT visible FROM ratings WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Rating not found' }, { status: 404 })
    }

    const currentVisible = rows[0].visible
    const newVisible = !currentVisible

    // Toggle visibility
    await getPool().query(
      'UPDATE ratings SET visible = ? WHERE id = ?',
      [newVisible, id]
    )

    return NextResponse.json({ success: true, visible: newVisible })
  } catch (error) {
    console.error('Failed to toggle rating visibility:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
