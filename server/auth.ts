import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "./db"
import { JWT_SECRET, JWT_EXPIRY } from "./config"
import { generateId, generateToken } from "./utils"

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export function generateJWT(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyJWT(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  country: string,
) {
  const userId = generateId()
  const hashedPassword = await hashPassword(password)
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO users (id, email, password, firstName, lastName, country, emailVerified, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
  `)

  stmt.run(userId, email, hashedPassword, firstName, lastName, country, now, now)

  return { id: userId, email, firstName, lastName, country, emailVerified: false }
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?")
  return stmt.get(email)
}

export function getUserById(userId: string) {
  const stmt = db.prepare(
    "SELECT id, email, firstName, lastName, country, emailVerified, createdAt FROM users WHERE id = ?",
  )
  return stmt.get(userId)
}

export function createEmailToken(userId: string): string {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  const tokenId = generateId()

  const stmt = db.prepare(`
    INSERT INTO email_tokens (id, userId, token, expiresAt, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `)

  stmt.run(tokenId, userId, token, expiresAt, new Date().toISOString())

  return token
}

export function verifyEmailToken(userId: string, token: string): boolean {
  const stmt = db.prepare(`
    SELECT * FROM email_tokens WHERE userId = ? AND token = ? AND expiresAt > ?
  `)

  const result = stmt.get(userId, token, new Date().toISOString())

  if (result) {
    // Mark email as verified
    const updateStmt = db.prepare("UPDATE users SET emailVerified = 1, updatedAt = ? WHERE id = ?")
    updateStmt.run(new Date().toISOString(), userId)

    // Delete the token
    const deleteStmt = db.prepare("DELETE FROM email_tokens WHERE id = ?")
    deleteStmt.run(result.id)

    return true
  }

  return false
}

export function createSession(userId: string): string {
  const sessionId = generateId()
  const token = generateJWT(userId)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

  const stmt = db.prepare(`
    INSERT INTO sessions (id, userId, token, expiresAt, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `)

  stmt.run(sessionId, userId, token, expiresAt, new Date().toISOString())

  return token
}

export function validateSession(token: string): { userId: string } | null {
  const decoded = verifyJWT(token)
  if (!decoded) return null

  const stmt = db.prepare("SELECT * FROM sessions WHERE token = ? AND expiresAt > ?")
  const session = stmt.get(token, new Date().toISOString())

  return session ? decoded : null
}
