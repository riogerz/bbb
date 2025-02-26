import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    CONTACT_EMAIL: z.string().email(),
    PINATA_API_KEY: z.string(),
    PINATA_API_SECRET: z.string(),
    PINATA_JWT: z.string(),
    PINATA_GATEWAY: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
    PINATA_JWT: process.env.PINATA_JWT,
    PINATA_GATEWAY: process.env.PINATA_GATEWAY,
  },
})

