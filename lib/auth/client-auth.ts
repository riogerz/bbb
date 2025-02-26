"use client"

// Función para verificar la sesión del administrador desde el cliente
export async function checkAdminSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/check-session")
    const data = await response.json()
    return data.authenticated === true
  } catch (error) {
    console.error("Error checking admin session:", error)
    return false
  }
}

// Función para cerrar sesión desde el cliente
export async function logoutClient(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })
    return response.ok
  } catch (error) {
    console.error("Error logging out:", error)
    return false
  }
}

