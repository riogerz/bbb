"use client"

import { memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLightbox } from "@/context/lightbox-context"
import type { GalleryImage } from "@/types"

interface GalleryGridProps {
  images: GalleryImage[]
}

export const GalleryGrid = memo(function GalleryGrid({ images }: GalleryGridProps) {
  const { openLightbox } = useLightbox()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <motion.div
          key={image.src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-zinc-900"
          onClick={() => openLightbox(index, images)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              openLightbox(index, images)
            }
          }}
          aria-label={`View ${image.alt}`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            priority={index < 6}
            quality={90}
          />
          <div
            className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  )
})

