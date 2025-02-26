"use client"

import { useState, useEffect } from "react"
import { RATE_LIMIT_DURATION, MAX_ATTEMPTS } from "@/lib/utils"

export function useRateLimit() {
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setIsBlocked(true)
      setTimeRemaining(RATE_LIMIT_DURATION)

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            clearInterval(timer)
            setIsBlocked(false)
            setAttempts(0)
            return 0
          }
          return prev - 1000
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [attempts])

  const increment = () => setAttempts((prev) => prev + 1)

  return {
    isBlocked,
    timeRemaining,
    increment,
    attemptsLeft: MAX_ATTEMPTS - attempts,
  }
}

