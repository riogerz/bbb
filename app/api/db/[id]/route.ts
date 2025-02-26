import { NextResponse } from "next/server"
import { pinataDB } from "@/lib/pinata-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const record = await pinataDB.get(params.id)

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      record,
    })
  } catch (error) {
    console.error("Error getting record:", error)
    return NextResponse.json(
      {
        error: "Error getting record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await pinataDB.update(params.id, data)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error updating record:", error)
    return NextResponse.json(
      {
        error: "Error updating record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await pinataDB.delete(params.id)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting record:", error)
    return NextResponse.json(
      {
        error: "Error deleting record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

