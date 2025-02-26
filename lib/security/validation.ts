import { z } from "zod"

// Esquemas de validación
export const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  name: z.string().min(2),
})

export const fileSchema = z.object({
  name: z.string(),
  type: z.string().regex(/^(image\/jpeg|image\/png|application\/pdf)$/),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
})

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .trim()
}

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  return file.size <= maxSize
}

