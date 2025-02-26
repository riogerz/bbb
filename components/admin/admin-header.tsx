"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function AdminHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { toast } = useToast()

  async function handleLogout() {
    try {
      setIsLoggingOut(true)

      // Simular un pequeño retraso para dar feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Eliminar la sesión del sessionStorage
      sessionStorage.removeItem("admin_authenticated")

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })

      // Recargar la página para volver al login
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cerrar sesión",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-zinc-800 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-lg font-bold">Panel de Administración</h1>
        <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cerrando sesión...
            </>
          ) : (
            "Cerrar sesión"
          )}
        </Button>
      </div>
    </header>
  )
}

