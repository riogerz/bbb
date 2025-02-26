"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

const galleryImages = [
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Tattoo artwork 1",
    category: "Black & Grey",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Tattoo artwork 2",
    category: "Color",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Tattoo artwork 3",
    category: "Traditional",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Tattoo artwork 4",
    category: "Japanese",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Tattoo artwork 5",
    category: "Minimalist",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Tattoo artwork 6",
    category: "Watercolor",
  },
]

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="gallery" className="relative bg-zinc-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Galería de Trabajos</h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-400">
              Cada tatuaje es una obra de arte única, diseñada específicamente para ti.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-800"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

