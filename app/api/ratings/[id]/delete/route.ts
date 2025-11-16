import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Delete the rating
    await query('DELETE FROM ratings WHERE id = ?', [id])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete rating error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
