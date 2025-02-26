const RATE_LIMIT_ATTEMPTS = 5
const RATE_LIMIT_WINDOW = 60 * 15 // 15 minutos

type RateLimitData = {
  attempts: number
  timestamp: number
}

const rateLimitStore = new Map<string, RateLimitData>()

export async function checkRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now()
  const data = rateLimitStore.get(ip)

  // Si no hay datos previos, crear nuevo registro
  if (!data) {
    rateLimitStore.set(ip, { attempts: 1, timestamp: now })
    return { success: true, remaining: RATE_LIMIT_ATTEMPTS - 1 }
  }

  // Si ha pasado el tiempo de la ventana, resetear
  if (now - data.timestamp > RATE_LIMIT_WINDOW * 1000) {
    rateLimitStore.set(ip, { attempts: 1, timestamp: now })
    return { success: true, remaining: RATE_LIMIT_ATTEMPTS - 1 }
  }

  // Si excede los intentos, calcular tiempo restante
  if (data.attempts >= RATE_LIMIT_ATTEMPTS) {
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW * 1000 - (now - data.timestamp)) / 1000)
    return { success: false, remaining: remainingTime }
  }

  // Incrementar intentos
  data.attempts += 1
  rateLimitStore.set(ip, data)

  return { success: true, remaining: RATE_LIMIT_ATTEMPTS - data.attempts }
}

