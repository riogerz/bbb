import { PyCrypto } from "../lib/crypto/pycrypto"
import { writeFile } from "fs/promises"
import { join } from "path"
import { randomBytes } from "crypto"

async function main() {
  try {
    console.log("🔐 Generando credenciales de administrador...")

    // Generar contraseña segura
    const password = randomBytes(8).toString("hex").slice(0, 12)

    // Generar hash de la contraseña
    const hash = await PyCrypto.hashPassword(password)

    // Generar clave de encriptación
    const encryptionKey = randomBytes(32).toString("hex")

    // Crear archivo .env.local
    const envContent = `
# Credenciales de administrador
ADMIN_PASSWORD_HASH=${hash}
ENCRYPTION_KEY=${encryptionKey}
    `.trim()

    await writeFile(join(process.cwd(), ".env.local"), envContent)

    console.log("\n✅ Credenciales generadas exitosamente:")
    console.log("🔑 Contraseña:", password)
    console.log("\n⚠️  IMPORTANTE: Guarda esta contraseña en un lugar seguro.")
    console.log("Las credenciales se han guardado en .env.local")
  } catch (error) {
    console.error("❌ Error generando credenciales:", error)
    process.exit(1)
  }
}

main()

