// Archivo para manejar variables de entorno con valores por defecto

export const env = {
  // Configuración de la aplicación
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Configuración de seguridad
  JWT_SECRET: process.env.JWT_SECRET || "fallback_jwt_secret_for_development_only",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "fallback_encryption_key_for_development_only",
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || "",

  // Configuración de almacenamiento
  FLEEK_API_KEY: process.env.FLEEK_API_KEY || "",
  FLEEK_BUCKET: process.env.FLEEK_BUCKET || "",
  PINATA_API_KEY: process.env.PINATA_API_KEY || "",
  PINATA_API_SECRET: process.env.PINATA_API_SECRET || "",
  PINATA_JWT: process.env.PINATA_JWT || "",
  PINATA_GATEWAY: process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud",

  // Configuración de contacto
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || "contacto@ejemplo.com",

  // Otras configuraciones
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@ejemplo.com",
}

