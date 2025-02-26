"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useStorage } from "@/hooks/use-storage"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Trash2, FileIcon, AlertTriangle, Search, Grid2x2, List } from "lucide-react"
import type { FleekFile } from "@/lib/server/fleek-service"
import { listFiles } from "@/app/actions/storage"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

export function StorageExplorer() {
  const [files, setFiles] = useState<FleekFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const { deleteFile } = useStorage({
    onDeleteSuccess: (key) => {
      setFiles((files) => files.filter((f) => f.key !== key))
    },
  })

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await listFiles()
      if (result.success) {
        setFiles(result.files)
      } else {
        throw new Error(result.error || "Failed to load files")
      }
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

  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files
    const term = searchTerm.toLowerCase()
    return files.filter((file) => file.key.toLowerCase().includes(term) || file.mimeType.toLowerCase().includes(term))
  }, [files, searchTerm])

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
            placeholder="Buscar archivos..."
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
            {searchTerm ? "No se encontraron archivos" : "No hay archivos almacenados"}
          </AlertDescription>
        </Alert>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.key} className="overflow-hidden">
              <CardContent className="p-0">
                {file.mimeType.startsWith("image/") ? (
                  <div className="relative aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.key}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => deleteFile(file.key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{file.key}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => deleteFile(file.key)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
            <div key={file.key} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
              <div className="flex items-center space-x-4">
                {file.mimeType.startsWith("image/") ? (
                  <div className="h-10 w-10 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.key}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{file.key}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button variant="destructive" size="icon" onClick={() => deleteFile(file.key)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

