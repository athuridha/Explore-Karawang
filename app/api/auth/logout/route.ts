import { NextResponse } from 'next/server'
import { logoutUser } from '@/app/actions/auth'

export async function POST() {
  const r = await logoutUser()
  if (!r.success) return NextResponse.json({ error: r.error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
