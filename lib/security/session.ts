import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { env } from "@/lib/env"

// Clave secreta para firmar los JWT
const SECRET = new TextEncoder().encode(env.JWT_SECRET || "fallback_jwt_secret_for_development_only")

export async function createSession(userId: string, role = "user") {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET)

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return token
}

export async function verifySession() {
  const token = cookies().get("session")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, SECRET)
    return verified.payload
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

export async function invalidateSession() {
  cookies().delete("session")
}

