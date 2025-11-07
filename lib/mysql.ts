import mysql from 'mysql2/promise'

// Reuse pool across hot reloads in Next.js dev
let pool: mysql.Pool

declare global {
  // eslint-disable-next-line no-var
  var __MYSQL_POOL__: mysql.Pool | undefined
}

export function getPool() {
  if (!global.__MYSQL_POOL__) {
    global.__MYSQL_POOL__ = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'karawang',
      connectionLimit: 10,
      charset: 'utf8mb4'
    })
  }
  return global.__MYSQL_POOL__
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params)
  return rows as T[]
}
