"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { Loader2 } from "lucide-react"

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallback?: string
}

export function ImageWithFallback({ src, fallback = "/placeholder.svg", alt, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      )}
      <Image
        {...props}
        src={error ? fallback : src}
        alt={alt}
        onError={() => setError(true)}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
}

