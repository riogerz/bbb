"use client"

// Versión cliente de las funciones de autenticación
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/verify-session")
    const data = await response.json()
    return data.authenticated === true
  } catch (error) {
    console.error("Error verifying admin session:", error)
    return false
  }
}

export async function login(password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

export async function logout(): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

