const STORAGE_PREFIX = "nyc_tattoo_"

export const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(STORAGE_PREFIX + key)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return null
    }
  },

  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, value)
      return true
    } catch (error) {
      console.error("Error writing to localStorage:", error)
      return false
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
      return true
    } catch (error) {
      console.error("Error removing from localStorage:", error)
      return false
    }
  },

  clear: (): boolean => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },
}

