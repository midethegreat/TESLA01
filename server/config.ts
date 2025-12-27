export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
export const JWT_EXPIRY = "7d"

// Email configuration
export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password",
  },
}

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@teslainvestment.com"
export const APP_URL = process.env.APP_URL || "http://localhost:3000"
