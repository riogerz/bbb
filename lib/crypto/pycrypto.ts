// Implementación inspirada en PyCryptodome para compatibilidad
export class PyCrypto {
  private static readonly BLOCK_SIZE = 16
  private static readonly KEY_SIZE = 32
  private static readonly IV_SIZE = 16
  private static readonly SALT_SIZE = 16
  private static readonly ITERATIONS = 100000
  private static readonly HASH_ALGORITHM = "SHA-512"

  // Función para generar bytes aleatorios usando Web Crypto API
  private static getRandomBytes(length: number): string {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = this.getRandomBytes(this.SALT_SIZE)

    // Usar SubtleCrypto para derivar la clave
    const encoder = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    )

    const bits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: this.ITERATIONS,
        hash: this.HASH_ALGORITHM,
      },
      keyMaterial,
      this.KEY_SIZE * 8,
    )

    const hash = Array.from(new Uint8Array(bits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return `${salt}.${hash}`
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [saltHex, hashHex] = hashedPassword.split(".")

    // Usar SubtleCrypto para derivar la clave
    const encoder = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    )

    const bits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(saltHex),
        iterations: this.ITERATIONS,
        hash: this.HASH_ALGORITHM,
      },
      keyMaterial,
      this.KEY_SIZE * 8,
    )

    const testHash = Array.from(new Uint8Array(bits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return testHash === hashHex
  }

  static async encrypt(data: string): Promise<{
    encrypted: string
    iv: string
    authTag: string
  }> {
    // Versión simplificada para el navegador
    // En producción, usaríamos SubtleCrypto para encriptación real
    const iv = this.getRandomBytes(this.IV_SIZE)

    // Simulación simple de encriptación para el ejemplo
    const encrypted = btoa(data)
    const authTag = this.getRandomBytes(16)

    return {
      encrypted,
      iv,
      authTag,
    }
  }

  static async decrypt(encrypted: string, iv: string, authTag: string): Promise<string> {
    // Versión simplificada para el navegador
    // En producción, usaríamos SubtleCrypto para desencriptación real
    return atob(encrypted)
  }
}

