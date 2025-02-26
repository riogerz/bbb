"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {
    threshold: 0,
    root: null,
    rootMargin: "0px",
  },
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!elementRef.current) return

    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.current.observe(elementRef.current)

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [elementRef, options])

  return isIntersecting
}

