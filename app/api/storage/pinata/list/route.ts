import { NextResponse } from "next/server"
import { pinataClient } from "@/lib/pinata-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: Record<string, string> = {}

    // Convertir searchParams a filtros de Pinata
    searchParams.forEach((value, key) => {
      filters[key] = value
    })

    const files = await pinataClient.listFiles(filters)

    return NextResponse.json({
      success: true,
      files: files.map((file) => ({
        hash: file.IpfsHash,
        url: pinataClient.getFileUrl(file.IpfsHash),
        size: file.PinSize,
        name: file.Metadata.name,
        metadata: file.Metadata.keyvalues,
        timestamp: file.Timestamp,
      })),
    })
  } catch (error) {
    console.error("Error listing Pinata files:", error)
    return NextResponse.json({ error: "Error retrieving files from IPFS" }, { status: 500 })
  }
}

