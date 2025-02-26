"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FileInput } from "@/components/ui/file-input"
import { useToast } from "@/components/ui/use-toast"
import { useStorage } from "@/hooks/use-storage"
import { Loader2 } from "lucide-react"

interface ImageUploadProps {
  maxSize: number
  acceptedTypes: string[]
  onUpload: (file: File) => void
}

export function ImageUpload({ maxSize, acceptedTypes, onUpload }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const { uploadFile, isLoading, progress } = useStorage({
    onUploadSuccess: (uploadedFile) => {
      onUpload(uploadedFile as any)
      setFile(null)
    },
  })
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `El archivo excede el tamaño máximo de ${maxSize}MB`,
      })
      return
    }

    if (!acceptedTypes.includes(selectedFile.type)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tipo de archivo no soportado",
      })
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      await uploadFile(file)
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Subir Imagen</Label>
        <FileInput id="image" onChange={handleFileChange} disabled={isLoading} accept={acceptedTypes.join(",")} />
      </div>

      {file && (
        <div className="rounded-md bg-muted p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
          </div>
        </div>
      )}

      <Button onClick={handleUpload} disabled={isLoading || !file} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo ({progress}%)
          </>
        ) : (
          "Subir"
        )}
      </Button>
    </div>
  )
}

