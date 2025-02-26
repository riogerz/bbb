"use client"

import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"

export function ToastContainer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <Toaster />
}

