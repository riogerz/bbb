import { fleekService } from "@/lib/server/fleek-service"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get("prefix") || undefined
    const files = await fleekService.listFiles(prefix)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Error listing files" }, { status: 500 })
  }
}

