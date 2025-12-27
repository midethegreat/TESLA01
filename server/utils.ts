import crypto from "crypto"

export function generateId(): string {
  return crypto.randomBytes(16).toString("hex")
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function generateVerificationCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase()
}
