import { NextResponse } from "next/server"
import { twoFactorAuth } from "@/lib/security/2fa"
import { verifySession } from "@/lib/security/session"

export async function POST(request: Request) {
  try {
    const session = await verifySession()
    const { token } = await request.json()

    const isValid = await twoFactorAuth.verifyToken(session.userId, token)

    if (!isValid) {
      return NextResponse.json({ error: "Código 2FA inválido" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error verificando 2FA" }, { status: 500 })
  }
}

