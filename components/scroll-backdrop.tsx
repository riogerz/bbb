"use client"

import { useEffect, useState } from "react"

export function ScrollBackdrop() {
  const [scrollValue, setScrollValue] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll percentage (0 to 1)
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      // Limit the value between 0 and 1
      setScrollValue(Math.min(1, Math.max(0, scrollPercent)))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backdropFilter: `blur(${scrollValue * 40}px)`,
        WebkitBackdropFilter: `blur(${scrollValue * 40}px)`,
        backgroundColor: `rgba(0, 0, 0, ${scrollValue * 0.5})`,
      }}
    />
  )
}

