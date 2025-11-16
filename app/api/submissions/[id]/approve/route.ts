import { NextResponse } from 'next/server'
import { approveSubmission } from '@/app/actions/submissions'

interface Params { params: { id: string } }

export async function POST(_req: Request, { params }: Params) {
  const id = params.id
  const res = await approveSubmission(id)
  if (!res.success) return NextResponse.json(res, { status: 400 })
  return NextResponse.json(res)
}
