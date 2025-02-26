import { create } from "zustand"
import { persist } from "zustand/middleware"
import { safeStorage } from "@/lib/safe-storage"

interface UserPreferences {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  reduceMotion: boolean
}

interface AppState {
  preferences: UserPreferences
  setTheme: (theme: UserPreferences["theme"]) => void
  setFontSize: (size: UserPreferences["fontSize"]) => void
  setReduceMotion: (reduce: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      preferences: {
        theme: "system",
        fontSize: "medium",
        reduceMotion: false,
      },
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),
      setFontSize: (fontSize) =>
        set((state) => ({
          preferences: { ...state.preferences, fontSize },
        })),
      setReduceMotion: (reduceMotion) =>
        set((state) => ({
          preferences: { ...state.preferences, reduceMotion },
        })),
    }),
    {
      name: "app-storage",
      storage: {
        getItem: (name) => {
          const str = safeStorage.get(name)
          if (!str) return null
          try {
            return JSON.parse(str)
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          safeStorage.set(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          safeStorage.remove(name)
        },
      },
    },
  ),
)

