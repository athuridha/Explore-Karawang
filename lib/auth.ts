import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import { query } from '@/lib/mysql'

export async function requireUser() {
  const user = await getUser()
  if (!user) return null
  return user
}

export async function getUser() {
  const token = cookies().get('session_token')?.value
  if (!token) return null
  const rows = await query<any>(
    'SELECT u.id, u.email, u.username, u.role FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.session_token=? AND s.expires_at > NOW() LIMIT 1',
    [token]
  )
  return rows[0] || null
}

export async function createSession(userId: string, minutes: number) {
  const token = crypto.randomBytes(32).toString('hex')
  const id = crypto.randomUUID()
  const expires = new Date(Date.now() + minutes * 60 * 1000)
  await query('INSERT INTO sessions (id, user_id, session_token, expires_at) VALUES (?, ?, ?, ?)', [
    id,
    userId,
    token,
    formatDateTime(expires),
  ])
  cookies().set('session_token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: minutes * 60 })
}

export async function destroySession() {
  const token = cookies().get('session_token')?.value
  if (token) {
    await query('DELETE FROM sessions WHERE session_token=?', [token])
    cookies().set('session_token', '', { path: '/', maxAge: 0 })
  }
}

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
