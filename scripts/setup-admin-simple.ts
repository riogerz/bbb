import { PyCrypto } from "../lib/crypto/pycrypto"
import { writeFile } from "fs/promises"
import { join } from "path"

async function main() {
  // Obtener la contraseña de los argumentos
  const password = process.argv[2]

  if (!password) {
    console.error("❌ Error: Debes proporcionar una contraseña")
    console.log("Uso: npx ts-node scripts/setup-admin-simple.ts TU_CONTRASEÑA")
    process.exit(1)
  }

  try {
    console.log("🔐 Configurando credenciales de administrador...")

    // Generar hash de la contraseña
    const hash = await PyCrypto.hashPassword(password)

    // Generar clave de encriptación aleatoria
    const encryptionKey = Buffer.from(
      Array(32)
        .fill(0)
        .map(() => Math.floor(Math.random() * 256)),
    ).toString("hex")

    // Crear o actualizar archivo .env.local
    const envContent = `
# Credenciales de administrador
ADMIN_PASSWORD_HASH=${hash}
ENCRYPTION_KEY=${encryptionKey}
    `.trim()

    await writeFile(join(process.cwd(), ".env.local"), envContent)

    console.log("\n✅ Credenciales configuradas exitosamente")
    console.log("Las credenciales se han guardado en .env.local")
  } catch (error) {
    console.error("❌ Error configurando credenciales:", error)
    process.exit(1)
  }
}

main()

