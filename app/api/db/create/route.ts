import { NextResponse } from "next/server"
import { pinataDB } from "@/lib/pinata-db"

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    if (!type || !data) {
      return NextResponse.json({ error: "Type and data are required" }, { status: 400 })
    }

    const id = await pinataDB.create(type, data)

    return NextResponse.json({
      success: true,
      id,
    })
  } catch (error) {
    console.error("Error creating record:", error)
    return NextResponse.json(
      {
        error: "Error creating record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

