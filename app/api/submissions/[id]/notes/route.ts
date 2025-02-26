import { NextResponse } from "next/server"
import { pinataDB } from "@/lib/pinata-db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await pinataDB.update(params.id, { notes: data.notes })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error updating notes" }, { status: 500 })
  }
}

