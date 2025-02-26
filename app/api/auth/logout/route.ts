import { NextResponse } from "next/server"
import { clearAdminSession } from "@/lib/auth/admin"

export async function POST() {
  try {
    clearAdminSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error logging out",
      },
      { status: 500 },
    )
  }
}

