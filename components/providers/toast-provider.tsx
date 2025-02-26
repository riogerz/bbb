"use client"

import { Toaster } from "@/components/ui/toaster"
import type { ReactNode } from "react"

interface ToastProviderProps {
  children: ReactNode
}

// Fix the ToastProvider component in case it exists
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

