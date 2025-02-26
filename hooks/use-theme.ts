"use client"

import { useEffect } from "react"

export function useTheme() {
  useEffect(() => {
    // Check if dark mode is preferred
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.classList.toggle("dark", isDarkMode)

    // Listen for changes in system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])
}

