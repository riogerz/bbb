import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"

interface AuditLog {
  action: string
  userId: string
  ip: string
  timestamp: string
  details: Record<string, any>
}

export class SecurityAudit {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      url: env.REDIS_URL,
      token: env.REDIS_TOKEN,
    })
  }

  async log(log: AuditLog): Promise<void> {
    await this.redis.lpush("security:audit", JSON.stringify(log))
  }

  async getRecentLogs(limit = 100): Promise<AuditLog[]> {
    const logs = await this.redis.lrange("security:audit", 0, limit - 1)
    return logs.map((log) => JSON.parse(log))
  }

  async searchLogs(query: Partial<AuditLog>): Promise<AuditLog[]> {
    const logs = await this.getRecentLogs(1000)
    return logs.filter((log) => Object.entries(query).every(([key, value]) => log[key as keyof AuditLog] === value))
  }
}

export const securityAudit = new SecurityAudit()

