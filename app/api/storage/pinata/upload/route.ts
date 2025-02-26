import { NextResponse } from "next/server"
import { pinataClient } from "@/lib/pinata-client"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const metadata = JSON.parse((formData.get("metadata") as string) || "{}")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const result = await pinataClient.uploadFile(file, metadata)

    return NextResponse.json({
      success: true,
      hash: result.IpfsHash,
      url: pinataClient.getFileUrl(result.IpfsHash),
      size: result.PinSize,
      timestamp: result.Timestamp,
    })
  } catch (error) {
    console.error("Error uploading to Pinata:", error)
    return NextResponse.json({ error: "Error uploading file to IPFS" }, { status: 500 })
  }
}

