// Configuración centralizada del almacenamiento
export const STORAGE_CONFIG = {
  // Límites y restricciones
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxTotalStorage: 10 * 1024 * 1024 * 1024, // 10GB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],

  // Carpetas predefinidas
  folders: {
    gallery: "gallery",
    clients: "clients",
    documents: "documents",
    temp: "temp",
  },

  // Configuración de optimización de imágenes
  imageOptimization: {
    maxWidth: 1200,
    quality: 85,
    format: "webp" as const,
  },

  // Configuración de caché
  cache: {
    duration: 5 * 60 * 1000, // 5 minutos
    prefix: "fleek_storage_",
  },
}

