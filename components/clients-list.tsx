"use client"

import { useState, useEffect, useCallback } from "react"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, UserPlus, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePinataDB } from "@/hooks/use-pinata-db"

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
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { find, create } = usePinataDB()

  // Modificar la función loadClients para asegurar que carga correctamente los datos
  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Iniciando carga de clientes...")

      // Primero intentar cargar desde localStorage directamente (formato antiguo)
      try {
        const storedClients = localStorage.getItem("tattoo_clients")
        console.log("Datos cargados de localStorage (formato antiguo):", storedClients)

        if (storedClients) {
          const parsedClients = JSON.parse(storedClients)
          if (Array.isArray(parsedClients) && parsedClients.length > 0) {
            // Ordenar por fecha más reciente primero
            const sortedClients = parsedClients.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )
            console.log("Clientes encontrados en localStorage (formato antiguo):", sortedClients.length)
            setClients(sortedClients)
            setIsLoading(false)
            return
          }
        }
      } catch (storageError) {
        console.warn("Error al acceder a localStorage (formato antiguo):", storageError)
      }

      // Intentar cargar desde Pinata DB (nuevo formato)
      try {
        // Buscar todos los registros con prefijo pinata_clients_
        const allKeys = Object.keys(localStorage)
        const clientKeys = allKeys.filter(
          (key) => key.startsWith("pinata_clients_") || key.startsWith("pinata_index_clients"),
        )

        console.log("Claves de Pinata encontradas:", clientKeys)

        if (clientKeys.length > 0) {
          // Intentar usar el índice primero
          const indexKey = "pinata_index_clients"
          if (localStorage.getItem(indexKey)) {
            const pinataClients = await find("clients")
            console.log("Clientes encontrados en Pinata DB:", pinataClients)

            if (pinataClients && pinataClients.length > 0) {
              // Ordenar por fecha más reciente primero
              const sortedClients = pinataClients.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              setClients(sortedClients)
              setIsLoading(false)
              return
            }
          } else {
            // Si no hay índice, intentar cargar directamente de las claves
            const loadedClients = []
            for (const key of clientKeys) {
              if (key !== "pinata_index_clients") {
                try {
                  const clientData = JSON.parse(localStorage.getItem(key) || "")
                  if (clientData && clientData.data) {
                    loadedClients.push(clientData.data)
                  }
                } catch (e) {
                  console.warn(`Error al parsear cliente ${key}:`, e)
                }
              }
            }

            if (loadedClients.length > 0) {
              console.log("Clientes cargados directamente de claves:", loadedClients.length)
              const sortedClients = loadedClients.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              setClients(sortedClients)
              setIsLoading(false)
              return
            }
          }
        }
      } catch (pinataError) {
        console.warn("Error al cargar desde Pinata DB:", pinataError)
      }

      // Si no hay datos en ninguna fuente, usar datos de ejemplo
      console.log("No se encontraron clientes, usando datos de ejemplo")
      setClients(MOCK_CLIENTS)
    } catch (error) {
      console.error("Error loading clients:", error)
      setError("No se pudieron cargar los clientes")
    } finally {
      setIsLoading(false)
    }
  }, [find])

  // Cargar clientes al montar el componente o cuando se actualiza
  useEffect(() => {
    loadClients()
  }, [loadClients, refreshTrigger])

  // Función para actualizar el estado de un cliente
  const updateClientStatus = async (id: string, newStatus: string) => {
    try {
      // Actualizar en el estado
      setClients((prevClients) =>
        prevClients.map((client) => (client.id === id ? { ...client, status: newStatus } : client)),
      )

      // Actualizar en localStorage
      try {
        const storedClients = localStorage.getItem("tattoo_clients")
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients)
          const updatedClients = parsedClients.map((client: Client) =>
            client.id === id ? { ...client, status: newStatus } : client,
          )
          localStorage.setItem("tattoo_clients", JSON.stringify(updatedClients))
        }
      } catch (storageError) {
        console.warn("Error al actualizar en localStorage:", storageError)
      }

      // Actualizar en Pinata IPFS
      try {
        // Obtener el cliente actual
        const currentClient = clients.find((client) => client.id === id)
        if (currentClient) {
          const updatedClient = { ...currentClient, status: newStatus }
          await create("clients", updatedClient)
          console.log("Cliente actualizado en Pinata IPFS:", updatedClient)
        }
      } catch (pinataError) {
        console.warn("Error al actualizar en Pinata IPFS:", pinataError)
      }
    } catch (error) {
      console.error("Error al actualizar estado del cliente:", error)
    }
  }

  // Función para refrescar la lista de clientes
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => setClients(MOCK_CLIENTS)}>
          Cargar datos de ejemplo
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Total: {clients.length} clientes</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <UserPlus className="h-12 w-12 text-zinc-500 mb-4" />
          <p className="text-zinc-500">No hay clientes registrados</p>
          <Button variant="outline" className="mt-4" onClick={() => setClients(MOCK_CLIENTS)}>
            Cargar datos de ejemplo
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
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
              {clients.map((client) => (
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
                      <Button variant="ghost" size="sm" onClick={() => setSelectedClient(client)}>
                        Ver detalles
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Nombre</h3>
                <p>{selectedClient.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{selectedClient.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Teléfono</h3>
                <p>{selectedClient.phone}</p>
              </div>
              <div>
                <h3 className="font-medium">Mensaje</h3>
                <p className="whitespace-pre-wrap">{selectedClient.message}</p>
              </div>
              <div>
                <h3 className="font-medium">Fecha</h3>
                <p>{formatDate(selectedClient.createdAt)}</p>
              </div>
              <div>
                <h3 className="font-medium">Estado</h3>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={selectedClient.status === "pending" ? "default" : "outline"}
                    onClick={() => updateClientStatus(selectedClient.id, "pending")}
                  >
                    Pendiente
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedClient.status === "contacted" ? "default" : "outline"}
                    onClick={() => updateClientStatus(selectedClient.id, "contacted")}
                  >
                    Contactado
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedClient.status === "completed" ? "default" : "outline"}
                    onClick={() => updateClientStatus(selectedClient.id, "completed")}
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

