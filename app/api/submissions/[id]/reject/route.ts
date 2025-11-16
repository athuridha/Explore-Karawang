import { NextResponse } from 'next/server'
import { rejectSubmission } from '@/app/actions/submissions'

interface Params { params: { id: string } }

export async function POST(req: Request, { params }: Params) {
  const id = params.id
  const body = await req.json().catch(() => ({}))
  const res = await rejectSubmission(id, body.notes)
  if (!res.success) return NextResponse.json(res, { status: 400 })
  return NextResponse.json(res)
}
