import { z } from "zod"
import type { ContactFormData } from "@/types"

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .transform((str) => str.trim()),

  phone: z
    .string()
    .regex(/^[0-9\-+\s]*$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .transform((str) => str.replace(/[^\d+]/g, "")),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .transform((str) => str.trim().toLowerCase()),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .transform((str) => str.trim()),
})

export function validateContactForm(data: ContactFormData): {
  success: boolean
  errors?: Record<string, string>
  sanitizedData?: ContactFormData
} {
  try {
    const sanitizedData = contactFormSchema.parse(data)
    return {
      success: true,
      sanitizedData: sanitizedData as ContactFormData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message
        }
      })
      return { success: false, errors }
    }
    return {
      success: false,
      errors: { _form: "Invalid form data" },
    }
  }
}

