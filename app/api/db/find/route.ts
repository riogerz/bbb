import { NextResponse } from "next/server"
import { pinataDB } from "@/lib/pinata-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (!type) {
      return NextResponse.json({ error: "Type parameter is required" }, { status: 400 })
    }

    // Construir query desde parámetros de búsqueda
    const query: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key !== "type") {
        query[key] = value
      }
    })

    const records = await pinataDB.find(type, query)

    return NextResponse.json({
      success: true,
      records,
    })
  } catch (error) {
    console.error("Error finding records:", error)
    return NextResponse.json(
      {
        error: "Error finding records",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

