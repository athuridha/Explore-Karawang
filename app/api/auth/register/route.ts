import { NextResponse } from 'next/server'
import { registerUser } from '@/app/actions/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, password } = body || {}
    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Email, username, dan password wajib' }, { status: 400 })
    }
    const result = await registerUser({ email, username, password })
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ user: result.data })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
