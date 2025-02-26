"use client"

import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

interface ImageProps extends NextImageProps {
  fallback?: string
}

export function Image({ className, fallback = "/placeholder.svg", ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const { preferences } = useStore()

  return (
    <div className={cn("relative overflow-hidden", isLoading && "animate-pulse bg-muted", className)}>
      <NextImage
        {...props}
        src={error ? fallback : props.src}
        className={cn(
          "object-cover transition-all",
          isLoading ? "scale-110 blur-lg" : "scale-100 blur-0",
          preferences.reduceMotion && "transition-none",
          props.className,
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
      />
    </div>
  )
}

