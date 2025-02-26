import { NextResponse } from "next/server"
import { pinataDB } from "@/lib/pinata-db"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const id = await pinataDB.create("submissions", data)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: "Error creating submission" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const submissions = await pinataDB.find("submissions")
    return NextResponse.json({ submissions })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching submissions" }, { status: 500 })
  }
}

