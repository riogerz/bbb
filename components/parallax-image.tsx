"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ParallaxImage({ src, alt, className = "", priority = false }: ParallaxImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <p className="text-sm text-white/50">Failed to load image</p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className={cn("object-cover", isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setError(true)
            }}
          />
        </div>
      )}
    </div>
  )
}

