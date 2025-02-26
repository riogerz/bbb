"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StorageExplorer } from "@/components/storage-explorer"
import { IPFSExplorer } from "@/components/ipfs-explorer"
import { StorageStats } from "@/components/storage-stats"
import { ImageUpload } from "@/components/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { STORAGE_CONFIG } from "@/lib/constants"

export function StorageTabs() {
  return (
    <Tabs defaultValue="local" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="local">Almacenamiento Local</TabsTrigger>
          <TabsTrigger value="ipfs">IPFS (Pinata)</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="local" className="space-y-6">
        <StorageStats />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Límites</h3>
                  <p className="text-sm text-muted-foreground">
                    Tamaño máximo por archivo: {STORAGE_CONFIG.maxFileSize / 1024 / 1024}MB
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tipos permitidos: {STORAGE_CONFIG.allowedImageTypes.join(", ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Carpetas</h3>
                  <ul className="text-sm text-muted-foreground">
                    {Object.entries(STORAGE_CONFIG.folders).map(([key, value]) => (
                      <li key={key}>
                        {key}: /{value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subir Archivo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                maxSize={STORAGE_CONFIG.maxFileSize / 1024 / 1024}
                acceptedTypes={STORAGE_CONFIG.allowedImageTypes}
                onUpload={(file) => {
                  console.log("Archivo subido:", file)
                }}
              />
            </CardContent>
          </Card>
        </div>

        <StorageExplorer />
      </TabsContent>

      <TabsContent value="ipfs" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información IPFS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Ventajas</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Almacenamiento descentralizado y permanente</li>
                    <li>• Contenido inmutable y verificable</li>
                    <li>• Accesible globalmente</li>
                    <li>• Resistente a la censura</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Gateway</h3>
                  <p className="text-sm text-muted-foreground">
                    Los archivos son accesibles a través del gateway de Pinata
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subir a IPFS</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                maxSize={10}
                acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/gif"]}
                onUpload={async (file) => {
                  const formData = new FormData()
                  formData.append("file", file)
                  formData.append(
                    "metadata",
                    JSON.stringify({
                      type: "tattoo",
                      uploadedBy: "admin",
                    }),
                  )

                  const response = await fetch("/api/storage/pinata/upload", {
                    method: "POST",
                    body: formData,
                  })

                  if (!response.ok) {
                    throw new Error("Error uploading to IPFS")
                  }

                  return response.json()
                }}
              />
            </CardContent>
          </Card>
        </div>

        <IPFSExplorer />
      </TabsContent>
    </Tabs>
  )
}

