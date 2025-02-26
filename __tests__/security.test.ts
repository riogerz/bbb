import { hashPassword, comparePasswords, encryptData, decryptData } from "@/lib/utils/security"
import { describe, test, expect } from "@jest/globals"

describe("Security Utils Tests", () => {
  // Test Argon2 password hashing
  test("should hash and verify password correctly", async () => {
    const password = "test-password"
    const hash = await hashPassword(password)

    // Verificar que el hash es diferente a la contraseña original
    expect(hash).not.toBe(password)

    // Verificar que la contraseña coincide con el hash
    const isValid = await comparePasswords(password, hash)
    expect(isValid).toBe(true)

    // Verificar que una contraseña incorrecta no coincide
    const isInvalid = await comparePasswords("wrong-password", hash)
    expect(isInvalid).toBe(false)
  })

  // Test data encryption
  test("should encrypt and decrypt data correctly", () => {
    const sensitiveData = "test-sensitive-data"
    const encrypted = encryptData(sensitiveData)

    // Verificar que los datos están encriptados
    expect(encrypted).not.toBe(sensitiveData)

    // Verificar que los datos se pueden desencriptar correctamente
    const decrypted = decryptData(encrypted)
    expect(decrypted).toBe(sensitiveData)
  })

  // Test password strength
  test("should generate strong password hash", async () => {
    const password = "test-password"
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)

    // Verificar que los hashes son diferentes (sal aleatoria)
    expect(hash1).not.toBe(hash2)

    // Verificar que ambos hashes son válidos
    expect(await comparePasswords(password, hash1)).toBe(true)
    expect(await comparePasswords(password, hash2)).toBe(true)
  })
})

