"use client"

import type React from "react"

import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastContainer } from "@/components/providers/toast-container"
import { Loading } from "@/components/loading"

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        {children}
        <ToastContainer />
      </Suspense>
    </ErrorBoundary>
  )
}

