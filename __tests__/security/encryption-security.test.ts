// Eliminar este archivo o comentar su contenido ya que usa crypto de Node.js
// Este archivo no es necesario en el entorno del navegador
/*
import { EnhancedFileEncryption } from "../../lib/utils/enhanced-file-encryption"
import { describe, test, expect, beforeAll } from "@jest/globals"
import * as crypto from "crypto"

describe("Encryption Security Tests", () => {
  // Datos de prueba
  const testPassword = "SecurePassword123!"
  const sensitiveData = "Información confidencial muy sensible"
  let testFile: File
  let largeFile: File
  let encryptedData: Buffer
  let metadata: any

  beforeAll(() => {
    // Crear archivos de prueba
    testFile = new File([sensitiveData], "test.txt", { type: "text/plain" })
    const largeContent = crypto.randomBytes(10 * 1024 * 1024) // 10MB de datos aleatorios
    largeFile = new File([largeContent], "large.bin", { type: "application/octet-stream" })
  })

  // Test 1: Verificar que el mismo archivo produce diferentes cifrados
  test("should produce different ciphertexts for same file", async () => {
    const encryption1 = await EnhancedFileEncryption.encryptFile(testFile, testPassword)
    const encryption2 = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    expect(encryption1.encryptedData).not.toEqual(encryption2.encryptedData)
    expect(encryption1.metadata.iv).not.toEqual(encryption2.metadata.iv)
    expect(encryption1.metadata.salt).not.toEqual(encryption2.metadata.salt)
  })

  // Test 2: Verificar la resistencia a manipulación
  test("should detect tampering", async () => {
    const { encryptedData, metadata } = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    // Modificar datos encriptados
    const tamperedData = Buffer.from(encryptedData)
    tamperedData[Math.floor(tamperedData.length / 2)] ^= 1 // Cambiar un bit

    await expect(EnhancedFileEncryption.decryptFile(tamperedData, metadata, testPassword)).rejects.toThrow()
  })

  // Test 3: Verificar el manejo de contraseñas incorrectas
  test("should fail with incorrect password", async () => {
    const { encryptedData, metadata } = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    await expect(EnhancedFileEncryption.decryptFile(encryptedData, metadata, "WrongPassword123!")).rejects.toThrow()
  })

  // Test 4: Prueba de fortaleza de la encriptación
  test("should use strong encryption parameters", async () => {
    const { metadata } = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    // Verificar longitud de IV (12 bytes para GCM)
    expect(metadata.iv.length).toBe(12)

    // Verificar longitud de salt (32 bytes recomendado)
    expect(metadata.salt.length).toBe(32)

    // Verificar longitud de authTag (16 bytes para GCM)
    expect(metadata.authTag.length).toBe(16)
  })

  // Test 5: Prueba de rendimiento y memoria con archivos grandes
  test("should handle large files efficiently", async () => {
    const startTime = process.hrtime()

    const { encryptedData, metadata } = await EnhancedFileEncryption.encryptFile(largeFile, testPassword)

    const decrypted = await EnhancedFileEncryption.decryptFile(encryptedData, metadata, testPassword)

    const [seconds, nanoseconds] = process.hrtime(startTime)
    const totalTime = seconds + nanoseconds / 1e9

    // Verificar que el proceso no tome más de 5 segundos para 10MB
    expect(totalTime).toBeLessThan(5)

    // Verificar que el tamaño descifrado coincide
    expect(decrypted.size).toBe(largeFile.size)
  })

  // Test 6: Prueba de cifrado híbrido
  test("should implement secure hybrid encryption", async () => {
    // Generar par de claves RSA
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    })

    const { encryptedData, encryptedKey, metadata } = await EnhancedFileEncryption.encryptHybrid(testFile, publicKey)

    // Verificar que la clave encriptada tiene el tamaño correcto (256 bytes para RSA-2048)
    expect(encryptedKey.length).toBe(256)

    // Verificar que los datos están encriptados
    expect(encryptedData).not.toContain(sensitiveData)
  })

  // Test 7: Prueba de resistencia a ataques de padding
  test("should be resistant to padding oracle attacks", async () => {
    const { encryptedData, metadata } = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    // Modificar el padding
    const tamperedData = Buffer.from(encryptedData)
    tamperedData[tamperedData.length - 1] ^= 1

    // Debería fallar con un error genérico, no específico de padding
    await expect(EnhancedFileEncryption.decryptFile(tamperedData, metadata, testPassword)).rejects.toThrow(
      "Decryption failed",
    )
  })

  // Test 8: Prueba de aleatoriedad de la encriptación
  test("should produce random-looking ciphertext", async () => {
    const { encryptedData } = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    // Análisis estadístico básico
    const frequencies = new Array(256).fill(0)
    for (const byte of encryptedData) {
      frequencies[byte]++
    }

    // Calcular la desviación estándar de las frecuencias
    const mean = encryptedData.length / 256
    const variance = frequencies.reduce((acc, freq) => acc + Math.pow(freq - mean, 2), 0) / 256
    const stdDev = Math.sqrt(variance)

    // La desviación estándar debería ser relativamente pequeña para datos aleatorios
    expect(stdDev / mean).toBeLessThan(0.3)
  })

  // Test 9: Prueba de consistencia de metadatos
  test("should preserve file metadata", async () => {
    const { metadata } = await EnhancedFileEncryption.encryptFile(testFile, testPassword)

    expect(metadata.metadata).toEqual({
      name: testFile.name,
      type: testFile.type,
      size: testFile.size,
    })
  })

  // Test 10: Prueba de límites y casos extremos
  test("should handle edge cases", async () => {
    // Archivo vacío
    const emptyFile = new File([], "empty.txt", { type: "text/plain" })
    const emptyEncryption = await EnhancedFileEncryption.encryptFile(emptyFile, testPassword)

    const emptyDecrypted = await EnhancedFileEncryption.decryptFile(
      emptyEncryption.encryptedData,
      emptyEncryption.metadata,
      testPassword,
    )

    expect(emptyDecrypted.size).toBe(0)

    // Contraseña muy larga
    const longPassword = "a".repeat(1024)
    await expect(EnhancedFileEncryption.encryptFile(testFile, longPassword)).resolves.toBeDefined()
  })
})
*/

