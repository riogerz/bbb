"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, ImageIcon } from "lucide-react"

export function StorageSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<{ name: string; type: string; size: number }[]>([
    { name: "imagen1.jpg", type: "image/jpeg", size: 1024000 },
    { name: "imagen2.png", type: "image/png", size: 2048000 },
    { name: "documento.pdf", type: "application/pdf", size: 512000 },
  ])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setUploading(true)

    // Simulación de carga
    setTimeout(() => {
      setFiles((prev) => [{ name: selectedFile.name, type: selectedFile.type, size: selectedFile.size }, ...prev])
      setSelectedFile(null)
      setUploading(false)
    }, 1500)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subir Archivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Seleccionar archivo</Label>
              <Input id="file" type="file" onChange={handleFileChange} />
            </div>

            {selectedFile && (
              <div className="rounded-md border border-zinc-700 p-3">
                <div className="flex items-center justify-between">
                  <span>{selectedFile.name}</span>
                  <span className="text-sm text-zinc-400">{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
              {uploading ? "Subiendo..." : "Subir Archivo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archivos Almacenados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border border-zinc-700 p-3">
                <div className="flex items-center gap-3">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-blue-400" />
                  ) : (
                    <FileText className="h-5 w-5 text-orange-400" />
                  )}
                  <span>{file.name}</span>
                </div>
                <span className="text-sm text-zinc-400">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

