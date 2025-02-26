// Constantes para rate limiting
export const MAX_ATTEMPTS = 5
export const RATE_LIMIT_DURATION = 60 * 1000 // 1 minuto

// Almacenamiento en memoria para rate limiting (en producción usaríamos Redis)
const rateLimitStore = new Map<string, { attempts: number; timestamp: number }>()

// Sanitización de entrada
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .trim()
}

// Función para generar bytes aleatorios usando Web Crypto API
function getRandomBytes(length: number): string {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Encriptación y desencriptación usando Web Crypto API
export async function encryptData(data: string): Promise<string> {
  // Versión simplificada para el navegador
  // En producción, usaríamos SubtleCrypto para encriptación real
  const iv = getRandomBytes(16)
  // Simulación simple de encriptación para el ejemplo
  const encrypted = btoa(data)
  return `${iv}:${encrypted}`
}

export function decryptData(encryptedData: string): string {
  // Versión simplificada para el navegador
  const parts = encryptedData.split(":")
  // Simulación simple de desencriptación para el ejemplo
  return atob(parts[1])
}

// Funciones para manejo de contraseñas
export async function hashPassword(password: string): Promise<string> {
  const salt = generateUserSalt()
  const hash = await deriveKey(password, salt)
  return `${salt}:${hash}`
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(":")
  const hash = await deriveKey(password, salt)
  return hash === storedHash
}

export function generateUserSalt(): string {
  return getRandomBytes(16)
}

export async function deriveKey(password: string, salt: string): Promise<string> {
  // Versión simplificada para el navegador
  // En producción, usaríamos SubtleCrypto para derivación de claves real
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Funciones para tokens y CSRF
export function generateSecureToken(): string {
  return getRandomBytes(32)
}

export function validateToken(token: string): boolean {
  // Validación básica: asegurarse de que el token tiene la longitud correcta y solo contiene caracteres hexadecimales
  return /^[a-f0-9]{64}$/i.test(token)
}

export function generateCSRFToken(): string {
  return generateSecureToken()
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken
}

// Rate limiting
export async function checkLoginAttempts(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record) {
    rateLimitStore.set(ip, { attempts: 1, timestamp: now })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  // Si ha pasado el tiempo de limitación, reiniciar contador
  if (now - record.timestamp > RATE_LIMIT_DURATION) {
    rateLimitStore.set(ip, { attempts: 1, timestamp: now })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  // Si ha excedido los intentos, denegar
  if (record.attempts >= MAX_ATTEMPTS) {
    const remainingTime = RATE_LIMIT_DURATION - (now - record.timestamp)
    return { allowed: false, remaining: Math.ceil(remainingTime / 1000) }
  }

  // Incrementar intentos
  record.attempts += 1
  rateLimitStore.set(ip, record)

  return { allowed: true, remaining: MAX_ATTEMPTS - record.attempts }
}

