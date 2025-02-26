"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface UsePinataDBOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function usePinataDB(options: UsePinataDBOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Crear un nuevo registro
  const create = async (type: string, data: any) => {
    try {
      setIsLoading(true)

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
        console.warn("Error parsing index:", e)
      }

      // Añadir a índice si no existe
      if (!index.includes(pinataKey)) {
        index.push(pinataKey)
        localStorage.setItem(indexKey, JSON.stringify(index))
      }

      console.log(`[Pinata DB] Created ${type} record:`, pinataData)

      // Evitamos llamar a callbacks que podrían causar actualizaciones de estado en cascada
      return dataWithId
    } catch (error) {
      console.error(`[Pinata DB] Error creating ${type}:`, error)
      const message = error instanceof Error ? error.message : `Error creating ${type}`
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Buscar registros
  const find = async (type: string, query: Record<string, any> = {}) => {
    try {
      setIsLoading(true)

      console.log(`[Pinata DB] Buscando registros de tipo ${type}...`)

      // Primero intentar con el índice
      const indexKey = `pinata_index_${type}`
      let records = []

      try {
        const storedIndex = localStorage.getItem(indexKey);
        if (storedIndex) {
          let index;
          try {
            index = JSON.parse(storedIndex);
            console.log(`[Pinata DB] Índice encontrado con ${index.length} entradas`);
            
            if (Array.isArray(index)) {
              // Recuperar cada registro
              for (const key of index) {
                try {
                  const storedRecord = localStorage.getItem(key);
                  if (storedRecord) {
                    const record = JSON.parse(storedRecord);

                    // Filtrar por query si es necesario
                    let matches = true;
                    for (const [queryKey, queryValue] of Object.entries(query)) {
                      if (record.data[queryKey] !== queryValue) {
                        matches = false;
                        break;
                      }
                    }

                    if (matches) {
                      records.push(record.data);
                    }
                  }
                } catch (recordError) {
                  console.warn(`Error parsing record ${key}:`, recordError);
                }
              }
            }
          } catch (parseError) {
            console.warn(`Error parsing index for ${type}:`, parseError);
            // Continue with empty index instead of throwing
          }
        } else {
          console.log(`[Pinata DB] No se encontró índice para ${type}, buscando directamente`);

          // Si no hay índice, buscar todas las claves que coincidan con el patrón
          const allKeys = Object.keys(localStorage);
          const typeKeys = allKeys.filter((key) => key.startsWith(`pinata_${type}_`));

          console.log(`[Pinata DB] Encontradas ${typeKeys.length} claves para ${type}`);

          // Crear el índice mientras recuperamos los registros
          const newIndex = [];

          for (const key of typeKeys) {
            try {
              const storedRecord = localStorage.getItem(key);
              if (storedRecord) {
                const record = JSON.parse(storedRecord);

                // Filtrar por query si es necesario
                let matches = true;
                for (const [queryKey, queryValue] of Object.entries(query)) {
                  if (record.data[queryKey] !== queryValue) {
                    matches = false;
                    break;
                  }
                }

                if (matches) {
                  records.push(record.data);
                }

                // Añadir a nuevo índice
                newIndex.push(key);
              }
            } catch (recordError) {
              console.warn(`Error parsing record ${key}:`, recordError);
            }
          }

          // Guardar el nuevo índice si encontramos registros
          if (newIndex.length > 0) {
            localStorage.setItem(indexKey, JSON.stringify(newIndex));
            console.log(`[Pinata DB] Creado nuevo índice con ${newIndex.length} entradas`);
          }
        }
      }

      // Si no encontramos registros en el formato nuevo, intentar con el formato antiguo\
      if (records.length === 0 && type === "clients") {
        try {
          const oldFormatData = localStorage.getItem("tattoo_clients")
          if (oldFormatData) {
            const oldRecords = JSON.parse(oldFormatData)
            if (Array.isArray(oldRecords) && oldRecords.length > 0) {
              console.log(`[Pinata DB] Encontrados ${oldRecords.length} registros en formato antiguo`)
              records = oldRecords
            }
          }
        } catch (oldFormatError) {
          console.warn("[Pinata DB] Error retrieving old format records:", oldFormatError)
        }
      }

      console.log(`[Pinata DB] Found ${records.length} ${type} records`)

      // Evitamos llamar a callbacks que podrían causar actualizaciones de estado en cascada
      return records
    } catch (error) {
      console.error(`[Pinata DB] Error finding ${type}:`, error)
      const message = error instanceof Error ? error.message : `Error finding ${type}`
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener un registro por ID
  const get = async (type: string, id: string) => {
    try {
      setIsLoading(true)

      const pinataKey = `pinata_${type}_${id}`
      const storedRecord = localStorage.getItem(pinataKey)

      if (!storedRecord) {
        return null
      }

      const record = JSON.parse(storedRecord)

      // Evitamos llamar a callbacks que podrían causar actualizaciones de estado en cascada
      return record.data
    } catch (error) {
      console.error(`[Pinata DB] Error getting ${type}:`, error)
      const message = error instanceof Error ? error.message : `Error getting ${type}`
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar un registro
  const update = async (type: string, id: string, data: any) => {
    try {
      setIsLoading(true)

      const pinataKey = `pinata_${type}_${id}`
      const storedRecord = localStorage.getItem(pinataKey)

      if (!storedRecord) {
        throw new Error(`Record ${type}/${id} not found`)
      }

      const record = JSON.parse(storedRecord)
      const updatedData = { ...record.data, ...data }
      const updatedRecord = {
        ...record,
        data: updatedData,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(pinataKey, JSON.stringify(updatedRecord))

      console.log(`[Pinata DB] Updated ${type} record:`, updatedRecord)

      // Evitamos llamar a callbacks que podrían causar actualizaciones de estado en cascada
      return updatedData
    } catch (error) {
      console.error(`[Pinata DB] Error updating ${type}:`, error)
      const message = error instanceof Error ? error.message : `Error updating ${type}`
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Eliminar un registro
  const remove = async (type: string, id: string) => {
    try {
      setIsLoading(true)

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
        console.warn("Error updating index:", e)
      }

      console.log(`[Pinata DB] Removed ${type} record: ${id}`)

      // Evitamos llamar a callbacks que podrían causar actualizaciones de estado en cascada
      return true
    } catch (error) {
      console.error(`[Pinata DB] Error removing ${type}:`, error)
      const message = error instanceof Error ? error.message : `Error removing ${type}`
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    create,
    find,
    get,
    update,
    remove,
    isLoading,
  }
}

