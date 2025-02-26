// Eliminar este archivo o comentar su contenido ya que usa crypto de Node.js
// Este archivo no es necesario en el entorno del navegador
/*
import * as forge from "node-forge"
import { env } from "@/lib/env"

// Configuración de encriptación para archivos
const ENCRYPTION_ALGORITHM = "AES-GCM"
const KEY_SIZE = 32 // 256 bits
const TAG_LENGTH = 128 // bits

interface EncryptedFile {
  iv: string
  encryptedData: string
  authTag: string
  salt: string
  metadata: {
    name: string
    type: string
    size: number
  }
}

export class FileEncryption {
  private static async deriveKey(password: string, salt: string): Promise<forge.util.ByteBuffer> {
    return new Promise((resolve) => {
      const derivedKey = forge.pkcs5.pbkdf2(
        password,
        salt,
        100000, // Iteraciones
        KEY_SIZE,
        "sha512",
      )
      resolve(derivedKey)
    })
  }

  /**
   * Encripta un archivo
   */
static
async
encryptFile(file: File)
: Promise<EncryptedFile>
{
  // Generar sal aleatoria
  const salt = forge.random.getBytesSync(16)

  // Derivar clave de encriptación
  const key = await this.deriveKey(env.ENCRYPTION_KEY, salt)

  // Generar IV aleatorio
  const iv = forge.random.getBytesSync(12)

  // Crear cipher
  const cipher = forge.cipher.createCipher("AES-GCM", key)
  cipher.start({
    iv: iv,
    tagLength: TAG_LENGTH,
  })

  // Leer y encriptar el archivo
  const arrayBuffer = await file.arrayBuffer()
  const fileData = forge.util.createBuffer(arrayBuffer)

  // Agregar los datos
  cipher.update(fileData)

  // Finalizar la encriptación
  cipher.finish()

  // Obtener datos encriptados y tag de autenticación
  const encryptedData = cipher.output
  const authTag = cipher.mode.tag

  return {
      iv: forge.util.encode64(iv),
      encryptedData: forge.util.encode64(encryptedData.getBytes()),
      authTag: forge.util.encode64(authTag.getBytes()),
      salt: forge.util.encode64(salt),
      metadata: {
        name: file.name,
        type: file.type,
        size: file.size,
      },
    }
}

/**
 * Desencripta un archivo
 */
static
async
decryptFile(encryptedFile: EncryptedFile)
: Promise<Blob>
{
  // Decodificar datos
  const iv = forge.util.decode64(encryptedFile.iv)
  const salt = forge.util.decode64(encryptedFile.salt)
  const encryptedData = forge.util.decode64(encryptedFile.encryptedData)
  const authTag = forge.util.decode64(encryptedFile.authTag)

  // Derivar clave
  const key = await this.deriveKey(env.ENCRYPTION_KEY, salt)

  // Crear decipher
  const decipher = forge.cipher.createDecipher("AES-GCM", key)
  decipher.start({
    iv: iv,
    tagLength: TAG_LENGTH,
    tag: forge.util.createBuffer(authTag),
  })

  // Desencriptar datos
  const buffer = forge.util.createBuffer(encryptedData)
  decipher.update(buffer)

  // Verificar y finalizar
  const pass = decipher.finish()
  if (!pass) {
    throw new Error("Falló la verificación de integridad del archivo")
  }

  // Convertir a Blob
  const decryptedArrayBuffer = new Uint8Array(forge.util.binary.raw.decode(decipher.output.getBytes())).buffer

  return new Blob([decryptedArrayBuffer], { type: encryptedFile.metadata.type })
}

/**
 * Verifica la integridad de un archivo encriptado
 */
static
async
verifyFileIntegrity(encryptedFile: EncryptedFile)
: Promise<boolean>
{
  try {
    await this.decryptFile(encryptedFile)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Encripta un archivo para compartir
 * Genera una clave única para el archivo
 */
static
async
encryptFileForSharing(file: File)
: Promise<
{
  encryptedFile: EncryptedFile
  shareKey: string
}
>
{
  // Generar clave única para compartir
  const shareKey = forge.random.getBytesSync(32)

  // Encriptar archivo con la clave única
  const salt = forge.random.getBytesSync(16)
  const key = await this.deriveKey(shareKey, salt)

  const iv = forge.random.getBytesSync(12)
  const cipher = forge.cipher.createCipher("AES-GCM", key)
  cipher.start({
    iv: iv,
    tagLength: TAG_LENGTH,
  })

  const arrayBuffer = await file.arrayBuffer()
  const fileData = forge.util.createBuffer(arrayBuffer)

  cipher.update(fileData)
  cipher.finish()

  const encryptedFile = {
    iv: forge.util.encode64(iv),
    encryptedData: forge.util.encode64(cipher.output.getBytes()),
    authTag: forge.util.encode64(cipher.mode.tag.getBytes()),
    salt: forge.util.encode64(salt),
    metadata: {
      name: file.name,
      type: file.type,
      size: file.size,
    },
  }

  return {
      encryptedFile,
      shareKey: forge.util.encode64(shareKey),
    }
}
}
*/

