import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://tesla-backend-ipk1.onrender.com"

    const response = await fetch(`${backendUrl}/api/kyc/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    console.log("[v0] KYC submitted successfully")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] KYC submit error:", error.message)
    return NextResponse.json({ error: "KYC submission failed" }, { status: 500 })
  }
}
