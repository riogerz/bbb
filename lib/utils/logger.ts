type SecurityEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGIN_ERROR"
  | "UNAUTHORIZED_ACCESS"
  | "CSRF_VIOLATION"
  | "RATE_LIMIT_EXCEEDED"

interface SecurityEvent {
  type: SecurityEventType
  timestamp?: Date
  user?: string
  ip?: string
  userAgent?: string
  error?: string
  details?: Record<string, unknown>
}

export async function logSecurityEvent(event: SecurityEvent) {
  const logEntry = {
    ...event,
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  }

  // En desarrollo, solo log en consola
  if (process.env.NODE_ENV === "development") {
    console.log("[Security Event]", logEntry)
    return
  }

  try {
    // En producción, enviar a servicio de logging
    // await fetch("your-logging-service", {
    //   method: "POST",
    //   body: JSON.stringify(logEntry)
    // })
    // También podríamos guardar en base de datos
    // await db.securityLogs.create({ data: logEntry })
  } catch (error) {
    console.error("Error logging security event:", error)
  }
}

