import { env } from "@/lib/env"
import { Redis } from "@upstash/redis"
import { Resend } from "resend"

interface SecurityNotification {
  type: "warning" | "critical" | "info"
  message: string
  details?: Record<string, any>
  timestamp: string
}

export class SecurityNotifications {
  private redis: Redis
  private resend: Resend
  private readonly NOTIFICATION_THROTTLE = 300 // 5 minutos

  constructor() {
    this.redis = new Redis({
      url: env.REDIS_URL,
      token: env.REDIS_TOKEN,
    })
    this.resend = new Resend(env.RESEND_API_KEY)
  }

  async notify(notification: Omit<SecurityNotification, "timestamp">): Promise<void> {
    const fullNotification: SecurityNotification = {
      ...notification,
      timestamp: new Date().toISOString(),
    }

    // Guardar notificación
    await this.redis.lpush("security:notifications", JSON.stringify(fullNotification))

    // Verificar throttling para notificaciones similares
    const throttleKey = `notify:throttle:${notification.type}`
    const isThrottled = await this.redis.exists(throttleKey)

    if (!isThrottled) {
      // Enviar email
      await this.sendEmail(fullNotification)

      // Establecer throttle
      await this.redis.setex(throttleKey, this.NOTIFICATION_THROTTLE, "1")
    }

    // Si es crítico, notificar siempre
    if (notification.type === "critical") {
      await this.sendEmail(fullNotification)
    }
  }

  private async sendEmail(notification: SecurityNotification): Promise<void> {
    const adminEmails = env.ADMIN_EMAILS.split(",")

    await this.resend.emails.send({
      from: "security@yourdomain.com",
      to: adminEmails,
      subject: `[${notification.type.toUpperCase()}] Alerta de Seguridad`,
      html: this.generateEmailTemplate(notification),
    })
  }

  private generateEmailTemplate(notification: SecurityNotification): string {
    return `
      <h2>Alerta de Seguridad - ${notification.type}</h2>
      <p><strong>Mensaje:</strong> ${notification.message}</p>
      <p><strong>Fecha:</strong> ${new Date(notification.timestamp).toLocaleString()}</p>
      ${
        notification.details
          ? `
        <h3>Detalles:</h3>
        <pre>${JSON.stringify(notification.details, null, 2)}</pre>
      `
          : ""
      }
    `
  }

  async getRecentNotifications(limit = 10): Promise<SecurityNotification[]> {
    const notifications = await this.redis.lrange("security:notifications", 0, limit - 1)
    return notifications.map((n) => JSON.parse(n))
  }
}

export const securityNotifications = new SecurityNotifications()

