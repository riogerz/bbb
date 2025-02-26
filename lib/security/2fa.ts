import { authenticator } from "otplib"
import QRCode from "qrcode"
import { env } from "@/lib/env"
import { Redis } from "@upstash/redis"

export class TwoFactorAuth {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      url: env.REDIS_URL,
      token: env.REDIS_TOKEN,
    })
  }

  async generateSecret(userId: string): Promise<{
    secret: string
    qrCode: string
  }> {
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(userId, "Tattoo Studio Admin", secret)

    // Generar QR
    const qrCode = await QRCode.toDataURL(otpauth)

    // Guardar secreto temporalmente hasta verificación
    await this.redis.setex(
      `2fa:setup:${userId}`,
      300, // 5 minutos para completar setup
      secret,
    )

    return { secret, qrCode }
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const secret = await this.redis.get(`2fa:secret:${userId}`)
    if (!secret) return false

    return authenticator.verify({
      token,
      secret,
    })
  }

  async enableFor(userId: string, token: string): Promise<boolean> {
    const setupSecret = await this.redis.get(`2fa:setup:${userId}`)
    if (!setupSecret) return false

    const isValid = authenticator.verify({
      token,
      secret: setupSecret,
    })

    if (isValid) {
      // Mover secreto a almacenamiento permanente
      await this.redis.set(`2fa:secret:${userId}`, setupSecret)
      await this.redis.del(`2fa:setup:${userId}`)
      return true
    }

    return false
  }

  async isEnabled(userId: string): Promise<boolean> {
    return (await this.redis.exists(`2fa:secret:${userId}`)) === 1
  }

  async disable(userId: string): Promise<void> {
    await this.redis.del(`2fa:secret:${userId}`)
  }
}

export const twoFactorAuth = new TwoFactorAuth()

