import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { env } from "@/lib/env"

// Clave secreta para verificar los JWT
const SECRET = new TextEncoder().encode(env.JWT_SECRET || "fallback_jwt_secret_for_development_only")

export async function getUserFromToken() {
  const token = cookies().get("session")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, SECRET)
    const userId = verified.payload.userId as string

    // En una aplicación real, buscaríamos el usuario en la base de datos
    // Aquí devolvemos un usuario simulado para desarrollo
    return {
      id: userId,
      name: "Usuario de Prueba",
      email: "usuario@ejemplo.com",
      role: verified.payload.role || "user",
      phone: "+1234567890",
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function generateToken(data: object): Promise<string> {
  // Esta función es un placeholder para la implementación real
  return "token_simulado"
}

export async function verifyToken(token: string): Promise<any> {
  // Esta función es un placeholder para la implementación real
  return { userId: "user_id_simulado" }
}

