"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageWithLoadingProps extends Omit<ImageProps, "onLoadingComplete" | "className"> {
  className?: string
  containerClassName?: string
}

export function ImageWithLoading({ className, containerClassName, ...props }: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
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
        <Image
          {...props}
          className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
        />
      )}
    </div>
  )
}

