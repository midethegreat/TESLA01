import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userId, token } = await req.json()

    if (!userId || !token) {
      return NextResponse.json({ error: "Missing verification data" }, { status: 400 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://tesla-backend-ipk1.onrender.com"

    const response = await fetch(`${backendUrl}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Email verification error:", error.message)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
