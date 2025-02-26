import { fleekService } from "@/lib/server/fleek-service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "No key provided" }, { status: 400 })
    }

    await fleekService.deleteFile(key)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 })
  }
}

