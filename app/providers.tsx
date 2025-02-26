"use client"

import { useState, useEffect, type ReactNode } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastProvider } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LightboxProvider } from "@/context/lightbox-context"
import { ThemeProvider } from "@/components/providers/theme-provider"

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
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ToastProvider>
          <LightboxProvider>
            {children}
            <Toaster />
          </LightboxProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

