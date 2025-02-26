"use client"

import { useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLightbox } from "@/context/lightbox-context"
import { cn } from "@/lib/utils"

export function Lightbox() {
  const { isOpen, currentIndex, images, closeLightbox, nextImage, prevImage } = useLightbox()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          prevImage()
          break
        case "ArrowRight":
          nextImage()
          break
        case "Escape":
          closeLightbox()
          break
        default:
          break
      }
    },
    [isOpen, prevImage, nextImage, closeLightbox],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      // Save previous focus
      const previousActiveElement = document.activeElement as HTMLElement

      // Focus the container
      containerRef.current?.focus()

      // Restore focus when closing
      return () => {
        previousActiveElement?.focus()
      }
    }
    return undefined
  }, [isOpen])

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
    >
      <div className="relative w-full max-w-7xl px-4" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-6 top-6 z-[110] text-white hover:bg-white/10"
          onClick={closeLightbox}
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="relative aspect-square md:aspect-[3/2]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full border-2 border-white/20" />
          </div>
          {currentImage && (
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt || ""}
              fill
              className={cn("object-contain opacity-0 transition-opacity duration-300", "group-hover:opacity-100")}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              quality={90}
              onLoadingComplete={(target) => {
                target.classList.remove("opacity-0")
              }}
            />
          )}
        </div>

        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="absolute inset-x-0 bottom-6 text-center">
          <p className="text-sm text-white/70" aria-live="polite">
            Image {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </div>
  )
}

