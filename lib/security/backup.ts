import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"
import { encrypt } from "./encryption"

export class SecurityLogBackup {
  private redis: Redis
  private s3: S3Client

  constructor() {
    this.redis = new Redis({
      url: env.REDIS_URL,
      token: env.REDIS_TOKEN,
    })

    this.s3 = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  async backupLogs(): Promise<void> {
    try {
      // Obtener todos los logs
      const logs = await this.redis.lrange("security:audit", 0, -1)

      if (logs.length === 0) return

      // Preparar el archivo de backup
      const timestamp = new Date().toISOString()
      const filename = `security-logs-${timestamp}.json`

      // Encriptar logs antes de guardar
      const encryptedData = await encrypt(JSON.stringify(logs))

      // Subir a S3
      await this.s3.send(
        new PutObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: `backups/${filename}`,
          Body: encryptedData,
          ContentType: "application/json",
          Metadata: {
            "encryption-type": "AES-256-GCM",
            timestamp: timestamp,
          },
        }),
      )

      // Registrar backup exitoso
      await this.redis.lpush(
        "backup:logs",
        JSON.stringify({
          timestamp,
          filename,
          logsCount: logs.length,
        }),
      )

      // Limpiar logs antiguos (mantener últimos 1000)
      await this.redis.ltrim("security:audit", 0, 999)
    } catch (error) {
      console.error("Error en backup:", error)
      throw error
    }
  }

  async getBackupHistory(): Promise<
    Array<{
      timestamp: string
      filename: string
      logsCount: number
    }>
  > {
    const history = await this.redis.lrange("backup:logs", 0, 9)
    return history.map((entry) => JSON.parse(entry))
  }
}

export const securityBackup = new SecurityLogBackup()

