"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Database, ImageIcon, Files, HardDrive } from "lucide-react"
import { listFiles } from "@/app/actions/storage"
import { STORAGE_CONFIG } from "@/lib/constants"
import { formatFileSize } from "@/lib/utils"

export function StorageStats() {
  const [stats, setStats] = useState({
    totalSize: STORAGE_CONFIG.maxTotalStorage,
    usedSpace: 0,
    fileCount: 0,
    imageCount: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      const result = await listFiles()
      if (result.success && result.files) {
        const files = result.files
        const totalSize = files.reduce((acc, file) => acc + file.size, 0)
        const imageCount = files.filter((file) => file.mimeType.startsWith("image/")).length

        setStats({
          totalSize: STORAGE_CONFIG.maxTotalStorage,
          usedSpace: totalSize,
          fileCount: files.length,
          imageCount,
        })
      }
    }
    loadStats()
  }, [])

  const usagePercentage = (stats.usedSpace / stats.totalSize) * 100

  const statsData = [
    {
      title: "Espacio Total",
      value: formatFileSize(stats.totalSize),
      icon: HardDrive,
      description: `${formatFileSize(stats.totalSize - stats.usedSpace)} disponibles`,
    },
    {
      title: "Archivos Totales",
      value: stats.fileCount.toString(),
      icon: Files,
      description: "Documentos y medios",
    },
    {
      title: "Imágenes",
      value: stats.imageCount.toString(),
      icon: ImageIcon,
      description: "JPG, PNG, WebP",
    },
    {
      title: "Uso de Almacenamiento",
      value: `${usagePercentage.toFixed(1)}%`,
      icon: Database,
      description: `${formatFileSize(stats.usedSpace)} usados`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            {stat.title === "Uso de Almacenamiento" && (
              <Progress
                value={usagePercentage}
                className="mt-2"
                indicatorClassName={
                  usagePercentage > 90 ? "bg-destructive" : usagePercentage > 75 ? "bg-warning" : "bg-primary"
                }
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

