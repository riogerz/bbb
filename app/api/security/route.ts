import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { createCipheriv, randomBytes } from "crypto"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case "hash":
        const hashedData = await hash(data, 12)
        return NextResponse.json({ result: hashedData })

      case "verify":
        const { password, hash } = data
        const isValid = await compare(password, hash)
        return NextResponse.json({ result: isValid })

      case "encrypt":
        const iv = randomBytes(16)
        const cipher = createCipheriv("aes-256-cbc", Buffer.from(env.ENCRYPTION_KEY), iv)
        let encrypted = cipher.update(data, "utf8", "hex")
        encrypted += cipher.final("hex")
        return NextResponse.json({
          result: {
            iv: iv.toString("hex"),
            encryptedData: encrypted,
          },
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Security operation error:", error)
    return NextResponse.json({ error: "Failed to process security operation" }, { status: 500 })
  }
}

