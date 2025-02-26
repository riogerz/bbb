"use client"

import { useCallback, useEffect, useRef } from "react"

interface RepeatingBannerProps {
  text: string
  count?: number
}

export function RepeatingBanner({ text, count = 10 }: RepeatingBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const animate = useCallback(() => {
    if (!containerRef.current) return

    const scrollAmount = -1 // Cambio a valor negativo para mover hacia la izquierda
    containerRef.current.scrollLeft += scrollAmount

    // Ajuste de la lógica de reinicio para movimiento hacia la izquierda
    if (containerRef.current.scrollLeft <= 0) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth / 2
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div className="border-y border-white/10 py-2 overflow-hidden" role="marquee">
      <div ref={containerRef} className="flex whitespace-nowrap">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="mx-8 text-sm uppercase tracking-wider text-white/70">
            {text} • CUSTOM DESIGNS • PROFESSIONAL STUDIO • SAFE AND STERILE ENVIRONMENT
          </span>
        ))}
      </div>
    </div>
  )
}

