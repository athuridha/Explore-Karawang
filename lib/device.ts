import crypto from 'node:crypto'
import { cookies, headers } from 'next/headers'

const DEVICE_COOKIE = 'ek_device_id'

// Ensure a device id exists (stored in httpOnly cookie)
export function ensureDeviceId(): string {
  const store = cookies()
  let id = store.get(DEVICE_COOKIE)?.value
  if (!id) {
    id = crypto.randomUUID().replace(/-/g,'')
    // cannot set cookie directly in helper from server component; should be used inside route handlers/actions
  }
  return id
}

// In a route handler you can call setDeviceId(res)
export function getOrCreateDeviceId(): string {
  const cookieStore = cookies()
  let val = cookieStore.get(DEVICE_COOKIE)?.value
  if (!val) {
    val = crypto.randomUUID().replace(/-/g,'')
    cookieStore.set({
      name: DEVICE_COOKIE,
      value: val,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
  }
  return val
}

export function getClientFingerprint(): { ip?: string; ua?: string } {
  const h = headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || undefined
  const ua = h.get('user-agent') || undefined
  return { ip, ua }
}
