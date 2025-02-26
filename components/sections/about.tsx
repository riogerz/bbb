"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-black py-24 sm:py-32">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Background pattern"
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sobre el Artista</h2>
            <p className="mt-4 text-lg text-gray-300">
              Con más de una década de experiencia en el arte del tatuaje, me especializo en crear diseños únicos y
              personalizados que cuentan tu historia. Mi pasión es combinar técnicas tradicionales con estilos
              contemporáneos para crear piezas atemporales.
            </p>
            <p className="mt-4 text-lg text-gray-300">
              Cada tatuaje es una colaboración entre el artista y el cliente, y me enorgullece dar vida a tu visión
              mientras garantizo los más altos estándares de seguridad y profesionalismo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square overflow-hidden rounded-xl lg:aspect-auto lg:h-full"
          >
            <Image src="/placeholder.svg?height=800&width=600" alt="Artist at work" fill className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

