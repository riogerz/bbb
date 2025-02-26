import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/utils/rate-limit"
import { sanitizeInput, encryptData } from "@/lib/utils/security"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1"
    const rateLimit = await checkRateLimit(ip, 3) // Límite más estricto para el formulario de contacto

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Demasiadas solicitudes. Por favor, espere ${Math.ceil(rateLimit.remaining)} segundos.`,
        },
        { status: 429 },
      )
    }

    // Validar y sanitizar datos
    const data = await request.json()
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      message: sanitizeInput(data.message),
    }

    // Validaciones básicas
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Encriptar datos sensibles antes de almacenar
    const encryptedMessage = encryptData(sanitizedData.message)

    // Aquí guardaríamos en la base de datos los datos encriptados
    console.log("Datos encriptados:", encryptedMessage)

    // Enviar email de confirmación
    if (env.CONTACT_EMAIL) {
      // Implementar envío de email seguro
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje recibido correctamente",
    })
  } catch (error) {
    console.error("Error en formulario de contacto:", error)
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
      },
      { status: 500 },
    )
  }
}

