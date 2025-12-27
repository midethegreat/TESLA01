import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "tesla-investment-secret-key-change-in-production"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    console.log("[v0] Admin login attempt:", email)

    // Demo admin credentials (CHANGE IN PRODUCTION!)
    if (email === "admin@example.com" && password === "password123") {
      const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "7d" })
      console.log("[v0] Admin login successful")
      return NextResponse.json({ token, role: "admin" })
    }

    if (email === "superadmin@example.com" && password === "password123") {
      const token = jwt.sign({ role: "superadmin", email }, JWT_SECRET, { expiresIn: "7d" })
      console.log("[v0] Superadmin login successful")
      return NextResponse.json({ token, role: "superadmin" })
    }

    console.log("[v0] Invalid admin credentials")
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error: any) {
    console.error("[v0] Admin login error:", error.message)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
