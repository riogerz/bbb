"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Trash2, FileIcon, AlertTriangle, Search, Grid2x2, List, LinkIcon } from "lucide-react"
import { usePinataStorage } from "@/hooks/use-pinata-storage"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

interface IPFSFile {
  hash: string
  url: string
  size: number
  name: string
  metadata: Record<string, string>
  timestamp: string
}

export function IPFSExplorer() {
  const [files, setFiles] = useState<IPFSFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const { deleteFile } = usePinataStorage({
    onDeleteSuccess: (hash) => {
      setFiles((files) => files.filter((f) => f.hash !== hash))
    },
  })
  const { toast } = useToast()

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/storage/pinata/list")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load files")
      }

      setFiles(data.files)
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Failed to load files")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "URL copiada",
        description: "La URL del archivo ha sido copiada al portapapeles",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo copiar la URL",
      })
    }
  }

  const filteredFiles = files.filter((file) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      file.name.toLowerCase().includes(term) ||
      Object.values(file.metadata || {}).some((value) => value.toLowerCase().includes(term))
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar archivos en IPFS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(viewMode === "grid" && "bg-muted")}
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(viewMode === "list" && "bg-muted")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <Alert>
          <AlertDescription>
            {searchTerm ? "No se encontraron archivos" : "No hay archivos almacenados en IPFS"}
          </AlertDescription>
        </Alert>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.hash} className="overflow-hidden">
              <CardContent className="p-0">
                {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity bg-black/50 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(file.url)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteFile(file.hash)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(file.url)}>
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteFile(file.hash)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div key={file.hash} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
              <div className="flex items-center space-x-4">
                {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <div className="h-10 w-10 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" onClick={() => copyToClipboard(file.url)}>
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => deleteFile(file.hash)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

