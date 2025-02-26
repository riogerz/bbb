"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { uploadFile, deleteFile } from "@/app/actions/storage"
import type { FleekFile } from "@/lib/server/fleek-service"
import { optimizeImage } from "@/lib/utils/image-optimizer"

interface UseStorageOptions {
  onUploadSuccess?: (file: FleekFile) => void
  onUploadError?: (error: Error) => void
  onDeleteSuccess?: (key: string) => void
  onDeleteError?: (error: Error) => void
}

export function useStorage(options: UseStorageOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    async (file: File, folder?: string) => {
      try {
        setIsLoading(true)
        setProgress(0)

        // Simular progreso inicial
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 40))
        }, 500)

        // Optimizar imagen si es necesario
        const optimizedFile = await optimizeImage(file)

        // Actualizar progreso para la optimización
        clearInterval(progressInterval)
        setProgress(50)

        // Preparar FormData
        const formData = new FormData()
        formData.append("file", optimizedFile)
        if (folder) {
          formData.append("folder", folder)
        }

        // Simular progreso de subida
        const uploadInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 500)

        const result = await uploadFile(formData)

        clearInterval(uploadInterval)
        setProgress(100)

        if (!result.success) {
          throw new Error(result.error)
        }

        toast({
          title: "Archivo subido",
          description: "El archivo se ha subido correctamente",
        })

        options.onUploadSuccess?.(result.file)
        return result.file
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al subir el archivo"
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        options.onUploadError?.(error as Error)
        throw error
      } finally {
        setIsLoading(false)
        setTimeout(() => setProgress(0), 1000)
      }
    },
    [options, toast],
  )

  const handleFileDelete = useCallback(
    async (key: string) => {
      try {
        setIsLoading(true)

        const result = await deleteFile(key)

        if (!result.success) {
          throw new Error(result.error)
        }

        toast({
          title: "Archivo eliminado",
          description: "El archivo se ha eliminado correctamente",
        })

        options.onDeleteSuccess?.(key)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al eliminar el archivo"
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        options.onDeleteError?.(error as Error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [options, toast],
  )

  return {
    uploadFile: handleFileUpload,
    deleteFile: handleFileDelete,
    isLoading,
    progress,
  }
}

