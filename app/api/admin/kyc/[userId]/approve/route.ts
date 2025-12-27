import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const token = req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://tesla-backend-ipk1.onrender.com"

    const response = await fetch(`${backendUrl}/api/admin/kyc/${userId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    console.log("[v0] KYC approved for user:", userId)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] KYC approval error:", error.message)
    return NextResponse.json({ error: "Approval failed" }, { status: 500 })
  }
}
