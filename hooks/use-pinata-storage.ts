"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface UsePinataStorageOptions {
  onUploadSuccess?: (data: any) => void
  onUploadError?: (error: Error) => void
  onDeleteSuccess?: (hash: string) => void
  onDeleteError?: (error: Error) => void
}

export function usePinataStorage(options: UsePinataStorageOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const uploadFile = useCallback(
    async (file: File, metadata: Record<string, string> = {}) => {
      try {
        setIsLoading(true)
        setProgress(0)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("metadata", JSON.stringify(metadata))

        // Simular progreso de carga
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 500)

        const response = await fetch("/api/storage/pinata/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setProgress(100)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Error uploading file")
        }

        const data = await response.json()

        toast({
          title: "Archivo subido",
          description: "El archivo se ha subido correctamente a IPFS",
        })

        options.onUploadSuccess?.(data)
        return data
      } catch (error) {
        console.error("Upload error:", error)
        const message = error instanceof Error ? error.message : "Error al subir el archivo"
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
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

  const deleteFile = useCallback(
    async (hash: string) => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/storage/pinata/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hash }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Error deleting file")
        }

        toast({
          title: "Archivo eliminado",
          description: "El archivo se ha eliminado correctamente de IPFS",
        })

        options.onDeleteSuccess?.(hash)
      } catch (error) {
        console.error("Delete error:", error)
        const message = error instanceof Error ? error.message : "Error al eliminar el archivo"
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
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
    uploadFile,
    deleteFile,
    isLoading,
    progress,
  }
}

