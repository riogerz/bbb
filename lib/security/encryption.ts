// Función para generar bytes aleatorios usando Web Crypto API
function getRandomBytes(length: number): string {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function encrypt(text: string): Promise<string> {
  // Versión simplificada para el navegador
  const iv = getRandomBytes(16)
  // Simulación simple de encriptación para el ejemplo
  const encrypted = btoa(text)
  return `${iv}:${encrypted}`
}

export async function decrypt(text: string): Promise<string> {
  try {
    const textParts = text.split(":")
    // Simulación simple de desencriptación para el ejemplo
    return atob(textParts[1])
  } catch (error) {
    console.error("Decryption error:", error)
    return ""
  }
}

