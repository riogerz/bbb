import { NextResponse } from "next/server"
import { securityAudit } from "@/lib/security/audit"
import { fail2ban } from "@/lib/security/fail2ban"

export async function GET() {
  try {
    // Obtener estadísticas de seguridad
    const [auditLogs, banStats] = await Promise.all([securityAudit.getRecentLogs(10), fail2ban.getStats()])

    // Analizar patrones sospechosos
    const suspiciousPatterns = auditLogs.filter((log) => {
      return log.action === "login_failed" || log.action === "invalid_token" || log.action === "file_upload_rejected"
    })

    return NextResponse.json({
      status: "healthy",
      lastScan: new Date().toISOString(),
      metrics: {
        totalBans: banStats.totalBanned,
        recentFailedAttempts: suspiciousPatterns.length,
        activeProtections: ["fail2ban", "csrf", "xss", "rate-limiting", "file-validation"],
      },
      recentIncidents: suspiciousPatterns,
    })
  } catch (error) {
    console.error("Error en escaneo de seguridad:", error)
    return NextResponse.json({ error: "Error en escaneo de seguridad" }, { status: 500 })
  }
}

