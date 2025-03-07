import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/auth/admin"

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession()

    return NextResponse.json({
      authenticated: isAuthenticated,
    })
  } catch (error) {
    console.error("Error verifying session:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "Error verifying session",
      },
      { status: 500 },
    )
  }
}

