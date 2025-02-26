"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, UserPlus, RefreshCw, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePinataDB } from "@/hooks/use-pinata-db"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
  status?: string
}

// Datos de ejemplo para desarrollo
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567890",
    message: "Interesada en un tatuaje de estilo realista",
    createdAt: "2024-02-20T10:00:00Z",
    status: "pending",
  },
  {
    id: "2",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+0987654321",
    message: "Consulta sobre cover up",
    createdAt: "2024-02-19T15:30:00Z",
    status: "contacted",
  },
  {
    id: "3",
    name: "Ana López",
    email: "ana@example.com",
    phone: "+1122334455",
    message: "Consulta sobre diseño personalizado",
    createdAt: "2024-02-18T09:15:00Z",
    status: "pending",
  },
]

export function ClientsList() {
  const [data, setData] = useState({
    clients: [] as Client[],
    isLoading: true,
    selectedClient: null as Client | null,
    error: null as string | null,
    debugInfo: null as string | null,
    showMockData: false,
  })
  const [refreshKey, setRefreshKey] = useState(0)

  // Obtener las funciones de Pinata DB
  const pinataDB = usePinataDB()
  // Almacenar una referencia estable a pinataDB
  const pinataDBRef = useRef(pinataDB)

  // Actualizar la referencia cuando pinataDB cambia
  useEffect(() => {
    pinataDBRef.current = pinataDB
  }, [pinataDB])

  // Memoizar la función para refrescar la lista de clientes
  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
    setData((prev) => ({ ...prev, debugInfo: null, error: null }))
  }, [])

  // Cargar clientes al montar el componente o cuando cambia refreshKey
  useEffect(() => {
    let isMounted = true
    setData((prev) => ({ ...prev, debugInfo: null }))

    const fetchData = async () => {
      try {
        if (!isMounted) return

        setData((prev) => ({ ...prev, isLoading: true, showMockData: false }))
        console.log("Iniciando carga de clientes...")

        // Verificar si Pinata DB está disponible
        const currentPinataDB = pinataDBRef.current
        if (!currentPinataDB) {
          console.warn("PinataDB no está disponible")
          setData((prev) => ({
            ...prev,
            debugInfo: prev.debugInfo
              ? prev.debugInfo + "\nPinataDB no está disponible"
              : "PinataDB no está disponible",
          }))
        } else {
          setData((prev) => ({
            ...prev,
            debugInfo: prev.debugInfo ? prev.debugInfo + "\nPinataDB está disponible" : "PinataDB está disponible",
          }))
        }

        let foundClients: Client[] = []
        let pinataError = null

        try {
          console.log("Buscando clientes en Pinata DB...")
          setData((prev) => ({
            ...prev,
            debugInfo: prev.debugInfo
              ? prev.debugInfo + "\nBuscando clientes en Pinata DB..."
              : "Buscando clientes en Pinata DB...",
          }))

          if (currentPinataDB && typeof currentPinataDB.find === "function") {
            const pinataClients = await currentPinataDB.find("clients")
            console.log("Respuesta de Pinata DB:", pinataClients)

            if (Array.isArray(pinataClients)) {
              setData((prev) => ({
                ...prev,
                debugInfo: prev.debugInfo
                  ? prev.debugInfo + `\nEncontrados ${pinataClients.length} clientes en Pinata DB`
                  : `Encontrados ${pinataClients.length} clientes en Pinata DB`,
              }))
              if (pinataClients.length > 0) {
                foundClients = pinataClients
              }
            }
          }
        } catch (error) {
          pinataError = error
          console.warn("Error al cargar desde Pinata DB:", error)
          setData((prev) => ({
            ...prev,
            debugInfo: prev.debugInfo
              ? prev.debugInfo +
                `\nError al cargar desde Pinata DB: ${error instanceof Error ? error.message : JSON.stringify(error)}`
              : `Error al cargar desde Pinata DB: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
          }))
        }

        // Si no hay datos en Pinata DB, intentar cargar desde localStorage
        if (foundClients.length === 0 && typeof window !== "undefined" && window.localStorage) {
          try {
            const storedClients = localStorage.getItem("tattoo_clients")
            if (storedClients) {
              const parsedClients = JSON.parse(storedClients)
              if (Array.isArray(parsedClients) && parsedClients.length > 0) {
                foundClients = parsedClients
                setData((prev) => ({
                  ...prev,
                  debugInfo: prev.debugInfo
                    ? prev.debugInfo + `\nEncontrados ${parsedClients.length} clientes en localStorage`
                    : `Encontrados ${parsedClients.length} clientes en localStorage`,
                }))
              }
            }
          } catch (storageError) {
            console.warn("Error al cargar desde localStorage:", storageError)
            setData((prev) => ({
              ...prev,
              debugInfo: prev.debugInfo
                ? prev.debugInfo + "\nError al acceder a localStorage"
                : "Error al acceder a localStorage",
            }))
          }
        }

        // Procesar los clientes encontrados
        if (foundClients.length > 0) {
          const clientsWithDates = foundClients.map((client) => ({
            ...client,
            createdAt: client.createdAt || new Date().toISOString(),
          }))
          const sortedClients = [...clientsWithDates].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime() || 0
            const dateB = new Date(b.createdAt).getTime() || 0
            return dateB - dateA
          })

          if (isMounted) {
            setData((prev) => {
              if (JSON.stringify(prev.clients) !== JSON.stringify(sortedClients)) {
                return { ...prev, clients: sortedClients }
              }
              return prev
            })
            setData((prev) => ({
              ...prev,
              debugInfo: prev.debugInfo
                ? prev.debugInfo + `\nMostrando ${sortedClients.length} clientes reales`
                : `Mostrando ${sortedClients.length} clientes reales`,
            }))
          }
        } else if (isMounted) {
          setData((prev) => ({ ...prev, clients: [] }))
          if (pinataError) {
            setData((prev) => ({
              ...prev,
              error: "Error al conectar con Pinata DB. Verifica tu conexión e inténtalo de nuevo.",
            }))
          }
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error)
        if (isMounted) {
          setData((prev) => ({ ...prev, error: "No se pudieron cargar los clientes. Por favor, intenta de nuevo." }))
        }
      } finally {
        if (isMounted) {
          setData((prev) => ({ ...prev, isLoading: false }))
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  // Memoizar la función para actualizar el estado de un cliente
  const updateClientStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      setData((prev) => ({
        ...prev,
        clients: prev.clients.map((client) => (client.id === id ? { ...client, status: newStatus } : client)),
      }))

      const currentPinataDB = pinataDBRef.current
      if (currentPinataDB && typeof currentPinataDB.update === "function") {
        await currentPinataDB.update("clients", id, { status: newStatus })
      }

      if (typeof window !== "undefined" && window.localStorage) {
        const storedClients = localStorage.getItem("tattoo_clients")
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients)
          if (Array.isArray(parsedClients)) {
            const updatedClients = parsedClients.map((client: Client) =>
              client.id === id ? { ...client, status: newStatus } : client,
            )
            localStorage.setItem("tattoo_clients", JSON.stringify(updatedClients))
          }
        }
      }
    } catch (error) {
      console.error("Error al actualizar estado del cliente:", error)
    }
  }, [])

  // Memoizar la función para cargar datos de ejemplo
  const loadMockData = useCallback(() => {
    setData((prev) => ({
      ...prev,
      clients: [...MOCK_CLIENTS],
      showMockData: true,
      debugInfo: prev.debugInfo ? prev.debugInfo + "\nCargados datos de ejemplo" : "Cargados datos de ejemplo",
    }))
  }, [])

  if (data.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) setData((prev) => ({ ...prev, selectedClient: null }))
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Total: {data.clients.length} clientes</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {data.debugInfo && (
        <Alert className="mb-4 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Información de depuración</AlertTitle>
          <AlertDescription>
            <pre className="text-xs whitespace-pre-wrap">{data.debugInfo}</pre>
          </AlertDescription>
        </Alert>
      )}

      {data.error && (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <p>{data.error}</p>
            <Button variant="outline" className="mt-2" onClick={handleRefresh}>
              Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {data.clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <UserPlus className="h-12 w-12 text-zinc-500 mb-4" />
          <p className="text-zinc-500">No hay clientes registrados</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={loadMockData}>
              Cargar datos de ejemplo
            </Button>
            <Button variant="default" onClick={handleRefresh}>
              Intentar cargar de nuevo
            </Button>
          </div>
        </div>
      ) : (
        <>
          {data.showMockData && (
            <Alert className="mb-4 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Datos de ejemplo</AlertTitle>
              <AlertDescription>
                Estás viendo datos de ejemplo. Para ver clientes reales, haz clic en "Actualizar".
              </AlertDescription>
            </Alert>
          )}
          <div className="h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.status === "contacted"
                            ? "secondary"
                            : client.status === "completed"
                              ? "default"
                              : "outline"
                        }
                      >
                        {client.status === "pending"
                          ? "Pendiente"
                          : client.status === "contacted"
                            ? "Contactado"
                            : client.status === "completed"
                              ? "Completado"
                              : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setData((prev) => ({ ...prev, selectedClient: client }))}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog open={!!data.selectedClient} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {data.selectedClient && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Nombre</h3>
                <p>{data.selectedClient.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{data.selectedClient.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Teléfono</h3>
                <p>{data.selectedClient.phone}</p>
              </div>
              <div>
                <h3 className="font-medium">Mensaje</h3>
                <p className="whitespace-pre-wrap">{data.selectedClient.message}</p>
              </div>
              <div>
                <h3 className="font-medium">Fecha</h3>
                <p>{formatDate(data.selectedClient.createdAt)}</p>
              </div>
              <div>
                <h3 className="font-medium">Estado</h3>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={data.selectedClient.status === "pending" ? "default" : "outline"}
                    onClick={() => updateClientStatus(data.selectedClient.id, "pending")}
                  >
                    Pendiente
                  </Button>
                  <Button
                    size="sm"
                    variant={data.selectedClient.status === "contacted" ? "default" : "outline"}
                    onClick={() => updateClientStatus(data.selectedClient.id, "contacted")}
                  >
                    Contactado
                  </Button>
                  <Button
                    size="sm"
                    variant={data.selectedClient.status === "completed" ? "default" : "outline"}
                    onClick={() => updateClientStatus(data.selectedClient.id, "completed")}
                  >
                    Completado
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

