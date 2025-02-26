import { NextResponse } from "next/server"
import { fail2ban } from "@/lib/security/fail2ban"

export async function GET() {
  try {
    const stats = await fail2ban.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}

