"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { login } from "@/lib/auth/admin-client"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const password = formData.get("password") as string

      const success = await login(password)

      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración",
        })
        onSuccess?.()
      } else {
        throw new Error("Credenciales inválidas")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Credenciales inválidas",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          className="border-zinc-800 bg-zinc-900"
        />
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
  )
}

