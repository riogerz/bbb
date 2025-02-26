import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Constantes para rate limiting
export const RATE_LIMIT_DURATION = 60 * 1000 // 1 minuto
export const MAX_ATTEMPTS = 5

// Utilidad para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatear tamaño de archivo
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Formatear fecha
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Otras utilidades
export function sanitizeInput(input: string): string {
  return input.trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9\-+\s]{10,}$/
  return phoneRegex.test(phone)
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `hace ${days} ${days === 1 ? "día" : "días"}`
  } else if (hours > 0) {
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`
  } else if (minutes > 0) {
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
  } else {
    return "hace unos momentos"
  }
}

