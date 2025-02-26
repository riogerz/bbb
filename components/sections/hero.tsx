"use client"

import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Tattoo studio background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
      </motion.div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            RIO
            <span className="block font-light tracking-wide">TATTOO STUDIO</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Arte que perdura. Diseños únicos que cuentan tu historia.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="min-w-[200px] bg-white text-black hover:bg-white/90">
              Reserva Ahora
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
              Ver Galería
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400">Scroll</span>
          <div className="h-12 w-0.5 bg-gradient-to-b from-white to-transparent" />
        </div>
      </motion.div>
    </div>
  )
}

