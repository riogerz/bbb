"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function StorageConfig() {
  const [apiKey, setApiKey] = useState("")
  const [bucket, setBucket] = useState("")
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<"unchecked" | "valid" | "invalid">("unchecked")
  const { toast } = useToast()

  useEffect(() => {
    // Cargar configuración inicial
    const loadConfig = async () => {
      try {
        // En un caso real, obtendríamos esto de una API
        setApiKey(process.env.FLEEK_API_KEY || "")
        setBucket(process.env.FLEEK_BUCKET || "")
        await checkConnection()
      } catch (error) {
        console.error("Error loading config:", error)
      }
    }

    loadConfig()
  }, [])

  const checkConnection = async () => {
    setChecking(true)
    try {
      // Simular verificación de conexión
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (apiKey && bucket) {
        setStatus("valid")
        toast({
          title: "Conexión exitosa",
          description: "La configuración de almacenamiento es válida",
        })
      } else {
        setStatus("invalid")
        toast({
          variant: "destructive",
          title: "Error de conexión",
          description: "Verifica tus credenciales",
        })
      }
    } catch (error) {
      setStatus("invalid")
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo verificar la conexión",
      })
    } finally {
      setChecking(false)
    }
  }

  const saveConfig = async () => {
    try {
      // En un caso real, guardaríamos esto en una API
      toast({
        title: "Configuración guardada",
        description: "Los cambios se aplicaron correctamente",
      })
      await checkConnection()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración",
      })
    }
  }

  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle>Configuración de Almacenamiento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            placeholder="Ingresa tu API Key de Fleek"
            className="bg-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bucket">Bucket</Label>
          <Input
            id="bucket"
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
            placeholder="Nombre del bucket"
            className="bg-zinc-800"
          />
        </div>

        {status !== "unchecked" && (
          <Alert variant={status === "valid" ? "default" : "destructive"}>
            <AlertDescription className="flex items-center gap-2">
              {status === "valid" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Conexión establecida
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Error de conexión
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={saveConfig} className="flex-1">
            Guardar Cambios
          </Button>
          <Button variant="outline" onClick={checkConnection} disabled={checking}>
            {checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Conexión"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

