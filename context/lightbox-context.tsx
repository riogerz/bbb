"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { GalleryImage } from "@/types"

interface LightboxContextType {
  isOpen: boolean
  currentIndex: number
  images: GalleryImage[]
  openLightbox: (index: number, images: GalleryImage[]) => void
  closeLightbox: () => void
  nextImage: () => void
  prevImage: () => void
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState<GalleryImage[]>([])

  const openLightbox = useCallback((index: number, newImages: GalleryImage[]) => {
    setCurrentIndex(index)
    setImages(newImages)
    setIsOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
  }, [])

  const nextImage = useCallback(() => {
    if (images.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    if (images.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const value = {
    isOpen,
    currentIndex,
    images,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
  }

  return <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>
}

export function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider")
  }
  return context
}

