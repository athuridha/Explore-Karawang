import { NextResponse } from 'next/server'
import { loginUser } from '@/app/actions/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body || {}
    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib' }, { status: 400 })
    }
    const result = await loginUser({ username, password })
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 401 })
    return NextResponse.json({ user: result.data })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
