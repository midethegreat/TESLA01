import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // In production, this would use Vercel Blob or Supabase Storage
    const path = `/uploads/${Date.now()}-${file.name}`
    console.log(`[v0] Uploading file to: ${path}`)

    return NextResponse.json({
      success: true,
      imagePath: path,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
