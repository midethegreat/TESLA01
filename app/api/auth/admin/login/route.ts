import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (email === "09051435773" && password === "oluwafolaranmi") {
      return NextResponse.json({
        success: true,
        token: "admin-jwt-token-simulated",
        role: "admin",
        user: { email: "09051435773", role: "admin" },
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
