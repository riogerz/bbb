import { NextResponse } from "next/server"
import { pinataDB } from "@/lib/pinata-db"

export async function GET() {
  try {
    const submissions = await pinataDB.find("submissions")
    return NextResponse.json({ count: submissions.length })
  } catch (error) {
    return NextResponse.json({ error: "Error counting submissions" }, { status: 500 })
  }
}

