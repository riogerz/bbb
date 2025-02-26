export const SITE_CONFIG = {
  name: "Estudio de Tatuajes",
  description: "Portfolio y reservas de tatuajes",
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: "/og-image.jpg",
  author: "Tu Nombre",
  links: {
    instagram: "https://instagram.com/tu-estudio",
    facebook: "https://facebook.com/tu-estudio",
  },
}

export const GALLERY_CATEGORIES = ["Todos", "Tradicional", "Realismo", "Blackwork", "Color", "Minimalista"] as const

export const BOOKING_CONFIG = {
  minNoticeHours: 24,
  maxFutureMonths: 3,
  depositPercentage: 20,
  cancellationHours: 48,
}

export const STORAGE_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxTotalStorage: 10 * 1024 * 1024 * 1024, // 10GB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  folders: {
    gallery: "gallery",
    clients: "clients",
    documents: "documents",
    temp: "temp",
  },
}

