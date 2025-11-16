import { NextResponse } from 'next/server'
import { createOwnerSubmission, listOwnerSubmissions } from '@/app/actions/submissions'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = (searchParams.get('status') as 'pending' | 'approved' | 'rejected') || 'pending'
  const res = await listOwnerSubmissions(status)
  return NextResponse.json(res)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await createOwnerSubmission(body)
    if (!res.success) return NextResponse.json(res, { status: 400 })
    return NextResponse.json(res)
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
