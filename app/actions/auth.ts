"use server"

import { verifyAdmin, createAdminSession, clearAdminSession } from "@/lib/auth/admin"

export async function login(password: string): Promise<boolean> {
  const isValid = await verifyAdmin(password)

  if (isValid) {
    await createAdminSession()
    return true
  }

  return false
}

export async function logout(): Promise<void> {
  clearAdminSession()
}

