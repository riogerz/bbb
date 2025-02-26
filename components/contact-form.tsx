"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { usePinataDB } from "@/hooks/use-pinata-db"
import { v4 as uuidv4 } from "uuid"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  phone: z.string().min(6, {
    message: "El teléfono debe tener al menos 6 caracteres.",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }),
})

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pinataDB = usePinataDB()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      console.log("Enviando formulario:", values)

      // Crear objeto de cliente
      const newClient = {
        id: uuidv4(),
        ...values,
        createdAt: new Date().toISOString(),
        status: "pending",
      }

      // Guardar en Pinata DB
      let savedToPinata = false
      try {
        if (pinataDB && typeof pinataDB.create === "function") {
          await pinataDB.create("clients", newClient)
          console.log("Cliente guardado en Pinata DB")
          savedToPinata = true
        } else {
          console.warn("La función create de PinataDB no está disponible")
        }
      } catch (pinataError) {
        console.error("Error al guardar en Pinata DB:", pinataError)
      }

      // Guardar en localStorage como respaldo
      try {
        const existingClients = localStorage.getItem("tattoo_clients")
        let clients = []

        if (existingClients) {
          clients = JSON.parse(existingClients)
        }

        if (!Array.isArray(clients)) {
          clients = []
        }

        clients.push(newClient)
        localStorage.setItem("tattoo_clients", JSON.stringify(clients))
        console.log("Cliente guardado en localStorage")
      } catch (storageError) {
        console.error("Error al guardar en localStorage:", storageError)

        // Si no se pudo guardar en Pinata ni en localStorage, mostrar error
        if (!savedToPinata) {
          toast.error("Error al guardar tu mensaje. Por favor, inténtalo de nuevo.")
          setIsSubmitting(false)
          return
        }
      }

      // Mostrar mensaje de éxito
      toast.success("¡Mensaje enviado con éxito! Te contactaremos pronto.")
      form.reset()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      toast.error("Error al enviar el formulario. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Tu número de teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos sobre el tatuaje que te gustaría hacerte..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </form>
    </Form>
  )
}

