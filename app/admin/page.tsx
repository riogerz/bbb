"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Función simplificada para verificar la contraseña
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Para desarrollo, aceptamos cualquier contraseña de al menos 4 caracteres
    // o la contraseña específica "admin123"
    if (password === "admin123" || password.length >= 4) {
      // Simular un pequeño retraso para dar feedback visual
      setTimeout(() => {
        setIsAuthenticated(true)
        setIsLoading(false)

        // Guardar en sessionStorage para mantener la sesión durante la navegación
        sessionStorage.setItem("admin_authenticated", "true")
      }, 800)
    } else {
      setIsLoading(false)
      setError("La contraseña debe tener al menos 4 caracteres")
    }
  }

  // Verificar si ya hay una sesión guardada
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_authenticated")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Si está autenticado, mostrar el dashboard
  if (isAuthenticated) {
    return <AdminDashboard />
  }

  // Si no está autenticado, mostrar el formulario de login simplificado
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>Ingresa la contraseña para acceder al panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Para desarrollo: usa "admin123" o cualquier contraseña de al menos 4 caracteres
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Acceso solo para administradores
        </CardFooter>
      </Card>
    </div>
  )
}

