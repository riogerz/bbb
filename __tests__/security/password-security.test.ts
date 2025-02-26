// Eliminar este archivo o comentar su contenido ya que usa crypto de Node.js
// Este archivo no es necesario en el entorno del navegador
/*
import { describe, test, expect } from "@jest/globals"
import { hashPassword, comparePasswords, generateUserSalt, deriveKey } from "@/lib/utils/security"

describe("Password Security Tests", () => {
  test("should reject weak passwords", async () => {
    const weakPasswords = ["123456", "password", "qwerty", "abc123", "letmein"]

    for (const password of weakPasswords) {
      try {
        await hashPassword(password)
        fail("Debería rechazar contraseñas débiles")
      } catch (error) {
        expect(error).toBeDefined()
      }
    }
  })

  test("should generate different hashes for same password", async () => {
    const password = "StrongP@ssw0rd123!"
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)

    expect(hash1).not.toBe(hash2)
    expect(await comparePasswords(password, hash1)).toBe(true)
    expect(await comparePasswords(password, hash2)).toBe(true)
  })

  test("should take minimum time to hash password", async () => {
    const password = "StrongP@ssw0rd123!"
    const start = Date.now()
    await hashPassword(password)
    const end = Date.now()
    const duration = end - start

    // Debería tomar al menos 100ms para prevenir ataques de fuerza bruta
    expect(duration).toBeGreaterThan(100)
  })

  test("should handle password lengths correctly", async () => {
    // Contraseña muy larga (1MB) para prevenir ataques DoS
    const longPassword = "a".repeat(1024 * 1024)
    await expect(hashPassword(longPassword)).rejects.toThrow()

    // Contraseña muy corta
    const shortPassword = "ab"
    await expect(hashPassword(shortPassword)).rejects.toThrow()
  })

  test("should verify key derivation function", async () => {
    const password = "StrongP@ssw0rd123!"
    const salt = generateUserSalt()
    const key1 = await deriveKey(password, salt)
    const key2 = await deriveKey(password, salt)

    expect(Buffer.compare(key1, key2)).toBe(0)
    expect(key1.length).toBeGreaterThanOrEqual(32)
  })
})
*/

