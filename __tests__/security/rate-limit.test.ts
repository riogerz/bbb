import { describe, test, expect, jest } from "@jest/globals"
import { checkLoginAttempts } from "@/lib/utils/security"

describe("Rate Limiting Tests", () => {
  test("should limit login attempts", async () => {
    const ip = "127.0.0.1"

    // Primera prueba: 5 intentos permitidos
    for (let i = 0; i < 5; i++) {
      const result = await checkLoginAttempts(ip)
      expect(result.allowed).toBe(true)
    }

    // Sexto intento: debería ser bloqueado
    const blocked = await checkLoginAttempts(ip)
    expect(blocked.allowed).toBe(false)
  })

  test("should reset after timeout", async () => {
    const ip = "127.0.0.2"

    // Usar todos los intentos
    for (let i = 0; i < 5; i++) {
      await checkLoginAttempts(ip)
    }

    // Simular espera de 15 minutos
    jest.advanceTimersByTime(15 * 60 * 1000)

    // Debería permitir nuevos intentos
    const result = await checkLoginAttempts(ip)
    expect(result.allowed).toBe(true)
  })

  test("should handle multiple IPs independently", async () => {
    const ip1 = "127.0.0.3"
    const ip2 = "127.0.0.4"

    // Bloquear ip1
    for (let i = 0; i < 6; i++) {
      await checkLoginAttempts(ip1)
    }

    // ip2 debería seguir permitiendo intentos
    const result = await checkLoginAttempts(ip2)
    expect(result.allowed).toBe(true)
  })
})

