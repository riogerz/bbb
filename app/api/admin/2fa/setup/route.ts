import { NextResponse } from "next/server"
import { twoFactorAuth } from "@/lib/security/2fa"
import { verifySession } from "@/lib/security/session"

export async function POST(request: Request) {
  try {
    const session = await verifySession()

    // Verificar si la sesión existe
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { secret, qrCode } = await twoFactorAuth.generateSecret(session.userId)

    return NextResponse.json({ secret, qrCode })
  } catch (error) {
    return NextResponse.json({ error: "Error generando 2FA" }, { status: 500 })
  }
}

