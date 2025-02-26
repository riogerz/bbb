"use client"

import { useToast } from "@/components/ui/use-toast"
import { pinataClient } from "./pinata-client"

// Configuración para depuración
const DEBUG = true

// Clase para manejar operaciones con Pinata DB
class PinataDB {
  private toast: ReturnType<typeof useToast> | null = null
  private cache: Map<string, any> = new Map()
  private debugMode = true

  constructor() {
    this.cache = new Map()
  }

  // Método para configurar el toast (opcional)
  setToast(toastInstance: ReturnType<typeof useToast>) {
    this.toast = toastInstance
  }

  // Mostrar mensajes de depuración
  private debug(...args: any[]) {
    if (DEBUG) {
      console.log("[Pinata DB]", ...args)
    }
  }

  // Mostrar errores
  private logError(message: string, error: any) {
    console.error(`[Pinata DB Error] ${message}:`, error)

    if (this.toast) {
      this.toast.toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Probar la conexión con Pinata
  async testConnection() {
    try {
      this.debug("Probando conexión con Pinata...")

      // Intentar listar archivos para verificar la conexión
      const files = await pinataClient.listFiles({ limit: 1 })

      if (files && Array.isArray(files.items)) {
        this.debug("Conexión exitosa con Pinata")
        return {
          success: true,
          message: `Conexión exitosa. ${files.items.length > 0 ? "Se encontraron archivos." : "No se encontraron archivos."}`,
        }
      } else {
        this.debug("Conexión establecida pero formato de respuesta inesperado")
        return {
          success: false,
          message: "Conexión establecida pero formato de respuesta inesperado",
        }
      }
    } catch (error) {
      this.logError("Error al probar la conexión", error)
      return {
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  // Crear un nuevo registro
  async create(type: string, data: any) {
    if (!type || typeof type !== "string") {
      throw new Error("El tipo de registro es requerido y debe ser una cadena")
    }

    if (!data || typeof data !== "object") {
      throw new Error("Los datos son requeridos y deben ser un objeto")
    }

    try {
      this.debug(`Creando registro de tipo ${type}...`)

      // Crear un ID único si no existe
      const recordId = data.id || `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      // Asegurarse de que el objeto tenga un ID
      const dataWithId = {
        ...data,
        id: recordId,
      }

      const pinataKey = `pinata_${type}_${recordId}`
      const pinataData = {
        id: recordId,
        type,
        data: dataWithId,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Guardar en localStorage
      localStorage.setItem(pinataKey, JSON.stringify(pinataData))

      // Mantener un índice de todos los registros por tipo
      const indexKey = `pinata_index_${type}`
      let index = []
      try {
        const storedIndex = localStorage.getItem(indexKey)
        if (storedIndex) {
          index = JSON.parse(storedIndex)
          if (!Array.isArray(index)) index = []
        }
      } catch (e) {
        this.debug("Error parsing index:", e)
      }

      // Añadir a índice si no existe
      if (!index.includes(pinataKey)) {
        index.push(pinataKey)
        localStorage.setItem(indexKey, JSON.stringify(index))
      }

      this.debug(`Creado registro ${type}:`, pinataData)
      return dataWithId
    } catch (error) {
      this.logError(`Error al crear registro ${type}`, error)
      throw error
    }
  }

  // Buscar registros
  async find(type: string, query: Record<string, any> = {}) {
    if (!type || typeof type !== "string") {
      throw new Error("El tipo de registro es requerido y debe ser una cadena")
    }

    try {
      this.debug(`Buscando registros de tipo ${type}...`)

      // Primero intentar con el índice
      const indexKey = `pinata_index_${type}`
      let records = []

      try {
        const storedIndex = localStorage.getItem(indexKey)
        if (storedIndex) {
          let index
          try {
            index = JSON.parse(storedIndex)
            this.debug(`Índice encontrado con ${index.length} entradas`)

            if (Array.isArray(index)) {
              // Recuperar cada registro
              for (const key of index) {
                try {
                  const storedRecord = localStorage.getItem(key)
                  if (storedRecord) {
                    const record = JSON.parse(storedRecord)

                    // Filtrar por query si es necesario
                    let matches = true
                    for (const [queryKey, queryValue] of Object.entries(query)) {
                      if (record.data[queryKey] !== queryValue) {
                        matches = false
                        break
                      }
                    }

                    if (matches) {
                      records.push(record.data)
                    }
                  }
                } catch (recordError) {
                  this.debug(`Error parsing record ${key}:`, recordError)
                }
              }
            }
          } catch (parseError) {
            this.debug(`Error parsing index for ${type}:`, parseError)
            // Continue with empty index instead of throwing
          }
        } else {
          this.debug(`No se encontró índice para ${type}, buscando directamente`)

          // Si no hay índice, buscar todas las claves que coincidan con el patrón
          const allKeys = Object.keys(localStorage)
          const typeKeys = allKeys.filter((key) => key.startsWith(`pinata_${type}_`))

          this.debug(`Encontradas ${typeKeys.length} claves para ${type}`)

          // Crear el índice mientras recuperamos los registros
          const newIndex = []

          for (const key of typeKeys) {
            try {
              const storedRecord = localStorage.getItem(key)
              if (storedRecord) {
                const record = JSON.parse(storedRecord)

                // Filtrar por query si es necesario
                let matches = true
                for (const [queryKey, queryValue] of Object.entries(query)) {
                  if (record.data[queryKey] !== queryValue) {
                    matches = false
                    break
                  }
                }

                if (matches) {
                  records.push(record.data)
                }

                // Añadir a nuevo índice
                newIndex.push(key)
              }
            } catch (recordError) {
              this.debug(`Error parsing record ${key}:`, recordError)
            }
          }

          // Guardar el nuevo índice si encontramos registros
          if (newIndex.length > 0) {
            localStorage.setItem(indexKey, JSON.stringify(newIndex))
            this.debug(`Creado nuevo índice con ${newIndex.length} entradas`)
          }
        }
      } catch (error) {
        this.debug("Error al buscar en índices:", error)
      }

      // Si no encontramos registros en el formato nuevo, intentar con el formato antiguo
      if (records.length === 0 && type === "clients") {
        try {
          const oldFormatData = localStorage.getItem("tattoo_clients")
          if (oldFormatData) {
            const oldRecords = JSON.parse(oldFormatData)
            if (Array.isArray(oldRecords) && oldRecords.length > 0) {
              this.debug(`Encontrados ${oldRecords.length} registros en formato antiguo`)
              records = oldRecords
            }
          }
        } catch (oldFormatError) {
          this.debug("Error retrieving old format records:", oldFormatError)
        }
      }

      // Si aún no hay registros, intentar buscar en Pinata
      if (records.length === 0) {
        try {
          this.debug("Intentando buscar en Pinata API...")

          // Aquí iría la lógica para buscar en Pinata API
          // Por ahora, esto es un placeholder para futura implementación
          const pinataResponse = await pinataClient.listFiles({
            status: "pinned",
            metadata: { keyvalues: { type: { value: type, op: "eq" } } },
          })

          if (pinataResponse && Array.isArray(pinataResponse.items)) {
            this.debug(`Encontrados ${pinataResponse.items.length} registros en Pinata API`)
            // Procesar los resultados de Pinata aquí
            // Este es un ejemplo simplificado
            for (const item of pinataResponse.items) {
              if (item.metadata?.keyvalues?.type === type) {
                // Aquí procesaríamos los datos de Pinata
                // Por ahora solo registramos que los encontramos
                this.debug(`Encontrado registro de tipo ${type} en Pinata:`, item.id)
              }
            }
          }
        } catch (pinataError) {
          this.debug("Error al buscar en Pinata API:", pinataError)
        }
      }

      this.debug(`Encontrados ${records.length} registros de tipo ${type}`)
      return records
    } catch (error) {
      this.logError(`Error al buscar registros ${type}`, error)
      return []
    }
  }

  // Obtener un registro por ID
  async get(type: string, id: string) {
    if (!type || typeof type !== "string") {
      throw new Error("El tipo de registro es requerido y debe ser una cadena")
    }

    if (!id || typeof id !== "string") {
      throw new Error("El ID es requerido y debe ser una cadena")
    }

    try {
      this.debug(`Obteniendo registro ${type}/${id}...`)

      const pinataKey = `pinata_${type}_${id}`
      const storedRecord = localStorage.getItem(pinataKey)

      if (!storedRecord) {
        this.debug(`No se encontró el registro ${type}/${id}`)
        return null
      }

      const record = JSON.parse(storedRecord)
      this.debug(`Registro encontrado:`, record.data)
      return record.data
    } catch (error) {
      this.logError(`Error al obtener registro ${type}/${id}`, error)
      return null
    }
  }

  // Actualizar un registro
  async update(type: string, id: string, data: any) {
    if (!type || typeof type !== "string") {
      throw new Error("El tipo de registro es requerido y debe ser una cadena")
    }

    if (!id || typeof id !== "string") {
      throw new Error("El ID es requerido y debe ser una cadena")
    }

    if (!data || typeof data !== "object") {
      throw new Error("Los datos son requeridos y deben ser un objeto")
    }

    try {
      this.debug(`Actualizando registro ${type}/${id}...`)

      const pinataKey = `pinata_${type}_${id}`
      const storedRecord = localStorage.getItem(pinataKey)

      if (!storedRecord) {
        throw new Error(`Registro ${type}/${id} no encontrado`)
      }

      const record = JSON.parse(storedRecord)
      const updatedData = { ...record.data, ...data }
      const updatedRecord = {
        ...record,
        data: updatedData,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(pinataKey, JSON.stringify(updatedRecord))
      this.debug(`Registro actualizado:`, updatedRecord)
      return updatedData
    } catch (error) {
      this.logError(`Error al actualizar registro ${type}/${id}`, error)
      throw error
    }
  }

  // Eliminar un registro
  async remove(type: string, id: string) {
    if (!type || typeof type !== "string") {
      throw new Error("El tipo de registro es requerido y debe ser una cadena")
    }

    if (!id || typeof id !== "string") {
      throw new Error("El ID es requerido y debe ser una cadena")
    }

    try {
      this.debug(`Eliminando registro ${type}/${id}...`)

      const pinataKey = `pinata_${type}_${id}`
      localStorage.removeItem(pinataKey)

      // Actualizar índice
      const indexKey = `pinata_index_${type}`
      try {
        const storedIndex = localStorage.getItem(indexKey)
        if (storedIndex) {
          let index = JSON.parse(storedIndex)
          if (Array.isArray(index)) {
            index = index.filter((key) => key !== pinataKey)
            localStorage.setItem(indexKey, JSON.stringify(index))
          }
        }
      } catch (e) {
        this.debug("Error updating index:", e)
      }

      this.debug(`Registro eliminado: ${type}/${id}`)
      return true
    } catch (error) {
      this.logError(`Error al eliminar registro ${type}/${id}`, error)
      return false
    }
  }

  // Limpiar caché
  clearCache(): void {
    const cacheSize = this.cache.size
    this.cache.clear()
    if (this.debugMode) {
      console.log(`Caché limpiada. Se eliminaron ${cacheSize} registros.`)
    }
  }

  // Activar/desactivar modo debug
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
    console.log(`Modo debug ${enabled ? "activado" : "desactivado"}`)
  }
}

// Exportar una instancia única de PinataDB
export const pinataDB = new PinataDB()

// También exportamos un hook para usar en componentes React
export function usePinataDB() {
  const toast = useToast()

  // Configurar el toast en la instancia de pinataDB
  pinataDB.setToast(toast)

  return pinataDB
}

