import { NextResponse } from "next/server"
import { verifyAdmin, createAdminSession } from "@/lib/auth/admin"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: "Password is required",
        },
        { status: 400 },
      )
    }

    const isValid = await verifyAdmin(password)

    if (isValid) {
      await createAdminSession()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    )
  }
}

