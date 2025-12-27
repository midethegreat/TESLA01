import crypto from "crypto"

export function generateId(): string {
  return crypto.randomBytes(16).toString("hex")
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function generateVerificationCode(): string {
  // Generate a random 6-digit number (100000 to 999999)
  return Math.floor(100000 + Math.random() * 900000).toString()
}
