"use server"

import { query } from "@/lib/mysql"
import bcrypt from "bcryptjs"
import crypto from "node:crypto"
import { cookies } from "next/headers"

const SESSION_DURATION_MINUTES = 60

export async function registerUser({ email, username, password }: { email: string; username: string; password: string }) {
  try {
    const existing = await query<any>("SELECT id FROM users WHERE email=? OR username=? LIMIT 1", [email, username])
    if (existing.length) {
      return { success: false, error: "Email atau username sudah dipakai" }
    }
    const id = crypto.randomUUID()
    const hash = await bcrypt.hash(password, 10)
    await query(
      "INSERT INTO users (id, email, password_hash, username, role) VALUES (?, ?, ?, ?, 'user')",
      [id, email, hash, username]
    )
    return { success: true, data: { id, email, username } }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function loginUser({ username, password }: { username: string; password: string }) {
  try {
    const rows = await query<any>("SELECT * FROM users WHERE username=? LIMIT 1", [username])
    if (!rows.length) return { success: false, error: "Username tidak ditemukan" }
    const user = rows[0]
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return { success: false, error: "Password salah" }

    const sessionId = crypto.randomUUID()
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + SESSION_DURATION_MINUTES * 60 * 1000)

    await query(
      "INSERT INTO sessions (id, user_id, session_token, expires_at) VALUES (?, ?, ?, ?)",
      [sessionId, user.id, token, formatDateTime(expires)]
    )

    const cookieStore = cookies()
    cookieStore.set("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_MINUTES * 60,
    })

    return { success: true, data: { id: user.id, email: user.email, username: user.username, role: user.role } }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function logoutUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("session_token")?.value
    if (token) {
      await query("DELETE FROM sessions WHERE session_token=?", [token])
      cookieStore.set("session_token", "", { path: "/", maxAge: 0 })
    }
    return { success: true }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export async function getCurrentUser() {
  try {
    const token = cookies().get("session_token")?.value
    if (!token) return null
    const rows = await query<any>(
      "SELECT u.id, u.email, u.username, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token=? AND s.expires_at > NOW() LIMIT 1",
      [token]
    )
    if (!rows.length) return null
    return rows[0]
  } catch {
    return null
  }
}

function formatDateTime(d: Date) {
  // MySQL DATETIME format YYYY-MM-DD HH:MM:SS
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
