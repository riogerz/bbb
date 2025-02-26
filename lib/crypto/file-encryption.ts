// Eliminar este archivo o comentar su contenido ya que usa crypto de Node.js
// Este archivo no es necesario en el entorno del navegador
/*
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
import { env } from "@/lib/env"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

interface EncryptedData {
  iv: string
  encryptedData: string
  authTag: string
}

export class FileEncryption {
  private static key = Buffer.from(env.ENCRYPTION_KEY, "hex")

  static encrypt(data: Buffer): EncryptedData {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM, this.key, iv)

    let encryptedData = cipher.update(data)
    encryptedData = Buffer.concat([encryptedData, cipher.final()])

    return {
      iv: iv.toString("hex"),
      encryptedData: encryptedData.toString("hex"),
      authTag: cipher.getAuthTag().toString("hex"),
    }
  }

  static decrypt(encryptedData: EncryptedData): Buffer {
    const decipher = createDecipheriv(ALGORITHM, this.key, Buffer.from(encryptedData.iv, "hex"))

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"))

    let decrypted = decipher.update(Buffer.from(encryptedData.encryptedData, "hex"))
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted
  }
}
*/

