"use client"

import { memo, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import type { GalleryImage } from "@/types"

interface GallerySectionProps {
  images: GalleryImage[]
  onImageClick: (index: number) => void
}

export const GallerySection = memo(function GallerySection({ images, onImageClick }: GallerySectionProps) {
  // Debug log
  useEffect(() => {
    console.log("Gallery images:", images)
  }, [images])

  // Take first 9 images without sorting
  const displayImages = images.slice(0, 9)

  return (
    <section className="bg-black px-4 py-16 sm:px-6 lg:px-8" id="gallery">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">Latest Work ({displayImages.length})</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayImages.map((image, index) => (
            <motion.div
              key={image.src || index} // Fallback to index if no src
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-zinc-900/50 backdrop-blur-sm"
              onClick={() => onImageClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onImageClick(index)
                }
              }}
              aria-label={`View ${image.alt || "gallery image"}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
              </div>

              {image.src ? (
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt || "Gallery image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  priority={index < 3} // Only prioritize first 3 images
                  quality={90}
                  onError={(e) => {
                    console.error(`Failed to load image: ${image.src}`)
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                  <span className="text-sm text-zinc-400">Image not available</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 p-4 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="line-clamp-2">{image.alt || "No description available"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

