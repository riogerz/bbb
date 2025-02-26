import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"

export class Fail2ban {
  private redis: Redis
  private readonly ATTEMPT_EXPIRY = 3600 // 1 hora
  private readonly BAN_DURATION = 86400 // 24 horas
  private readonly MAX_ATTEMPTS = 5

  constructor() {
    this.redis = new Redis({
      url: env.REDIS_URL,
      token: env.REDIS_TOKEN,
    })
  }

  /**
   * Registra un intento fallido y verifica si la IP debe ser baneada
   */
  async recordFailedAttempt(ip: string, action: string): Promise<boolean> {
    const key = `fail2ban:${ip}:${action}`
    const banKey = `fail2ban:banned:${ip}`

    // Verificar si la IP está baneada
    const isBanned = await this.redis.get(banKey)
    if (isBanned) {
      return true
    }

    // Incrementar contador de intentos
    const attempts = await this.redis.incr(key)

    // Establecer expiración si es el primer intento
    if (attempts === 1) {
      await this.redis.expire(key, this.ATTEMPT_EXPIRY)
    }

    // Banear IP si excede intentos máximos
    if (attempts >= this.MAX_ATTEMPTS) {
      await this.banIP(ip)
      return true
    }

    return false
  }

  /**
   * Banea una IP por el tiempo configurado
   */
  private async banIP(ip: string): Promise<void> {
    const banKey = `fail2ban:banned:${ip}`
    await this.redis.setex(banKey, this.BAN_DURATION, "banned")

    // Registrar el evento de baneo
    await this.logBanEvent(ip)
  }

  /**
   * Verifica si una IP está baneada
   */
  async isBanned(ip: string): Promise<boolean> {
    const banKey = `fail2ban:banned:${ip}`
    return (await this.redis.exists(banKey)) === 1
  }

  /**
   * Registra eventos de baneo para análisis
   */
  private async logBanEvent(ip: string): Promise<void> {
    const event = {
      ip,
      timestamp: new Date().toISOString(),
      reason: "Exceso de intentos fallidos",
    }
    await this.redis.lpush("fail2ban:logs", JSON.stringify(event))
  }

  /**
   * Obtiene estadísticas de baneos
   */
  async getStats(): Promise<{
    totalBanned: number
    recentBans: Array<{ ip: string; timestamp: string }>
  }> {
    const bannedKeys = await this.redis.keys("fail2ban:banned:*")
    const logs = await this.redis.lrange("fail2ban:logs", 0, 9)

    return {
      totalBanned: bannedKeys.length,
      recentBans: logs.map((log) => JSON.parse(log)),
    }
  }

  /**
   * Desbanea una IP específica
   */
  async unbanIP(ip: string): Promise<void> {
    const banKey = `fail2ban:banned:${ip}`
    await this.redis.del(banKey)
  }

  /**
   * Limpia intentos fallidos de una IP
   */
  async clearAttempts(ip: string, action: string): Promise<void> {
    const key = `fail2ban:${ip}:${action}`
    await this.redis.del(key)
  }
}

// Instancia singleton
export const fail2ban = new Fail2ban()

