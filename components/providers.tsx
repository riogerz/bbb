"use client"

import { useState, useEffect, type ReactNode } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "next-themes"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  )
}

