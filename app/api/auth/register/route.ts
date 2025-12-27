import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Register endpoint called")
    const body = await req.json()

    const { email, password, firstName, lastName, country } = body

    if (!email || !password || !firstName || !lastName || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Call external backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://tesla-backend-ipk1.onrender.com"
    console.log("[v0] Calling backend at:", backendUrl)

    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log("[v0] Backend error:", data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log("[v0] Registration successful:", email)
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Register error:", error.message)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
