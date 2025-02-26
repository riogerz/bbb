import { NextResponse } from "next/server"
import { pinataClient } from "@/lib/pinata-client"

export async function POST(request: Request) {
  try {
    const { hash } = await request.json()

    if (!hash) {
      return NextResponse.json({ error: "No hash provided" }, { status: 400 })
    }

    await pinataClient.deleteFile(hash)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting from Pinata:", error)
    return NextResponse.json({ error: "Error deleting file from IPFS" }, { status: 500 })
  }
}

