import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Login endpoint called")
    const body = await req.json()

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://tesla-backend-ipk1.onrender.com"

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log("[v0] Login failed:", data.error)
      return NextResponse.json(data, { status: response.status })
    }

    console.log("[v0] Login successful:", email)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Login error:", error.message)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
