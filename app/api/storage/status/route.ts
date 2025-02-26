import { NextResponse } from "next/server"
import { fleekService } from "@/lib/server/fleek-service"

export async function GET() {
  try {
    const status = await fleekService.checkStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error checking storage status:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

