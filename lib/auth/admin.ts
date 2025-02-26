import { cookies } from "next/headers"
import { PyCrypto } from "@/lib/crypto/pycrypto"
import { env } from "@/lib/env"

// Contraseña temporal para desarrollo
const DEV_PASSWORD_HASH = "salt.hash" // Esto es solo un placeholder

export async function verifyAdmin(password: string): Promise<boolean> {
  try {
    // En un entorno real, usaríamos env.ADMIN_PASSWORD_HASH
    // Para desarrollo, permitimos una contraseña temporal: "admin123"
    if (password === "admin123") {
      return true
    }

    // Intenta verificar con el hash almacenado si existe
    const storedHash = env.ADMIN_PASSWORD_HASH || DEV_PASSWORD_HASH
    return await PyCrypto.verifyPassword(password, storedHash)
  } catch (error) {
    console.error("Error verifying admin:", error)
    return false
  }
}

export async function createAdminSession(): Promise<void> {
  const sessionId = crypto.randomUUID()
  const { encrypted, iv, authTag } = await PyCrypto.encrypt(sessionId)

  cookies().set("admin_session", encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  cookies().set("admin_session.iv", iv, { httpOnly: true, secure: true })
  cookies().set("admin_session.tag", authTag, { httpOnly: true, secure: true })
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const sessionCookie = cookies().get("admin_session")
    const ivCookie = cookies().get("admin_session.iv")
    const tagCookie = cookies().get("admin_session.tag")

    if (!sessionCookie || !ivCookie || !tagCookie) {
      return false
    }

    await PyCrypto.decrypt(sessionCookie.value, ivCookie.value, tagCookie.value)
    return true
  } catch (error) {
    return false
  }
}

export function clearAdminSession(): void {
  cookies().delete("admin_session")
  cookies().delete("admin_session.iv")
  cookies().delete("admin_session.tag")
}

