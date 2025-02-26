"use client"

import type React from "react"

import { useState } from "react"
import { usePinataDB } from "@/hooks/use-pinata-db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function BookingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { create } = usePinataDB()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        id: Date.now().toString(),
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        message: formData.get("message") as string,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      // Guardar en localStorage con manejo de errores
      try {
        const existingClients = JSON.parse(localStorage.getItem("tattoo_clients") || "[]")
        existingClients.push(data)
        localStorage.setItem("tattoo_clients", JSON.stringify(existingClients))
      } catch (storageError) {
        console.warn("No se pudo guardar en localStorage:", storageError)
        // Continuar con el flujo aunque falle el localStorage
      }

      // Intentar guardar en PinataDB
      try {
        await create("submissions", data)
      } catch (pinataError) {
        console.warn("Error al guardar en PinataDB:", pinataError)
        // No interrumpir el flujo si falla PinataDB
      }

      toast({
        title: "Success",
        description: "Your booking request has been submitted.",
      })

      // Reset form
      event.currentTarget.reset()
    } catch (error) {
      console.error("Error en el envío:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" type="tel" placeholder="Phone" required />
      <Textarea name="message" placeholder="Tell us about your tattoo idea" required />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  )
}

