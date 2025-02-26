export interface GalleryImage {
  src: string
  alt: string
  priority?: boolean
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface FormSubmitResponse {
  success: boolean
  error?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: "Instagram" | "Twitter" | "Ticket"
}

export interface FAQItem {
  question: string
  answer: string
}

