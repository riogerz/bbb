"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, useInView } from "framer-motion"
import { Instagram, Mail, MapPin, Phone } from "lucide-react"

export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="contact" className="bg-zinc-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contacto</h2>
          <p className="mt-4 text-lg text-gray-300">
            ¿Listo para comenzar tu proyecto? Contáctanos para programar una consulta.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ubicación</h3>
                <p className="mt-1 text-gray-300">Calle Principal 123, Ciudad</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Teléfono</h3>
                <p className="mt-1 text-gray-300">+34 123 456 789</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="mt-1 text-gray-300">info@riotattoo.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Instagram className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Instagram</h3>
                <p className="mt-1 text-gray-300">@riotattoo</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <Input placeholder="Nombre" />
            </div>
            <div>
              <Input type="email" placeholder="Email" />
            </div>
            <div>
              <Input placeholder="Teléfono (opcional)" />
            </div>
            <div>
              <Textarea placeholder="Tu mensaje" className="min-h-[150px]" />
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
              Enviar Mensaje
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

