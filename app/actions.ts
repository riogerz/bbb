"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/utils/rate-limit"
import { sanitizeInput } from "@/lib/utils/security"

export async function loginAction(formData: FormData) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1"
    const rateLimit = await checkRateLimit(ip)

    if (!rateLimit.success) {
      return {
        success: false,
        error: `Demasiados intentos. Por favor, espere ${Math.ceil(rateLimit.remaining)} segundos.`,
      }
    }

    // Sanitizar inputs
    const email = sanitizeInput(formData.get("email") as string)
    const password = sanitizeInput(formData.get("password") as string)

    // Validar inputs
    if (!email || !password) {
      return {
        success: false,
        error: "Email y contraseña son requeridos",
      }
    }

    // En producción, verificaríamos contra la base de datos
    // Por ahora, usar credenciales de desarrollo
    if (email === "admin@example.com" && password === "admin123") {
      // Establecer cookie de autenticación
      cookies().set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 horas
      })

      redirect("/admin")
    }

    return {
      success: false,
      error: "Credenciales inválidas",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "Error en el servidor",
    }
  }
}

