"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Search,
  Download,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePinataDB } from "@/hooks/use-pinata-db"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

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

export function ClientsDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [showMockData, setShowMockData] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Client>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)

  // Get the Pinata DB functions
  const pinataDB = usePinataDB()
  // Store a stable reference to pinataDB
  const pinataDBRef = useRef(pinataDB)

  // Update the ref when pinataDB changes
  useEffect(() => {
    pinataDBRef.current = pinataDB
  }, [pinataDB])

  // Función para refrescar la lista de clientes
  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
    setDebugInfo(null)
    setError(null)
  }, [])

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshIntervalRef.current = setInterval(() => {
        handleRefresh()
      }, 30000) // Refresh every 30 seconds
    } else if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current)
    }

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current)
      }
    }
  }, [autoRefresh, handleRefresh])

  // Cargar clientes al montar el componente o cuando cambia refreshKey
  useEffect(() => {
    let isMounted = true
    setDebugInfo(null)

    const fetchData = async () => {
      // Evitar ejecutar si el componente ya no está montado
      if (!isMounted) return

      try {
        setIsLoading(true)
        setShowMockData(false)
        console.log("Iniciando carga de clientes...")

        // Verificar si Pinata DB está disponible
        const currentPinataDB = pinataDBRef.current
        const debugMessages = []

        if (!currentPinataDB) {
          console.warn("PinataDB no está disponible")
          debugMessages.push("PinataDB no está disponible")
        } else {
          debugMessages.push("PinataDB está disponible")
        }

        // Intentar cargar desde Pinata DB
        let foundClients = []
        let pinataError = null

        try {
          console.log("Buscando clientes en Pinata DB...")
          debugMessages.push("Buscando clientes en Pinata DB...")

          // Use the ref to access pinataDB
          const currentPinataDB = pinataDBRef.current

          // Safely access the find function
          if (currentPinataDB && typeof currentPinataDB.find === "function") {
            const pinataClients = await currentPinataDB.find("clients")
            console.log("Respuesta de Pinata DB:", pinataClients)

            if (Array.isArray(pinataClients)) {
              debugMessages.push(`Encontrados ${pinataClients.length} clientes en Pinata DB`)

              if (pinataClients.length > 0) {
                console.log(`Encontrados ${pinataClients.length} clientes en Pinata DB`)
                foundClients = pinataClients
              } else {
                console.log("No se encontraron clientes en Pinata DB")
                debugMessages.push("No se encontraron clientes en Pinata DB")
              }
            } else {
              console.log("Respuesta de Pinata DB no es un array:", pinataClients)
              debugMessages.push("Respuesta de Pinata DB no es un array")
            }
          } else {
            console.warn("La función find de PinataDB no está disponible")
            debugMessages.push("La función find de PinataDB no está disponible")
          }
        } catch (error) {
          pinataError = error
          console.warn("Error al cargar desde Pinata DB:", error)
          if (error instanceof Error) {
            console.warn("Error message:", error.message)
            console.warn("Error stack:", error.stack)
            debugMessages.push(`Error al cargar desde Pinata DB: ${error.message}`)
          } else {
            console.warn("Error no estándar:", error)
            debugMessages.push(`Error al cargar desde Pinata DB: ${JSON.stringify(error)}`)
          }
        }

        // Si no hay datos en Pinata DB, intentar cargar desde localStorage (formato antiguo)
        if (foundClients.length === 0) {
          try {
            console.log("Intentando cargar desde localStorage...")
            debugMessages.push("Intentando cargar desde localStorage...")

            if (typeof window === "undefined" || !window.localStorage) {
              console.warn("localStorage no está disponible")
              debugMessages.push("localStorage no está disponible")
            } else {
              const storedClients = localStorage.getItem("tattoo_clients")
              if (storedClients) {
                try {
                  const parsedClients = JSON.parse(storedClients)
                  if (Array.isArray(parsedClients) && parsedClients.length > 0) {
                    console.log(`Encontrados ${parsedClients.length} clientes en localStorage`)
                    debugMessages.push(`Encontrados ${parsedClients.length} clientes en localStorage`)
                    foundClients = parsedClients
                  } else {
                    console.log("No se encontraron clientes en localStorage o el formato es incorrecto")
                    debugMessages.push("No se encontraron clientes en localStorage o el formato es incorrecto")
                  }
                } catch (parseError) {
                  console.warn("Error al parsear JSON desde localStorage:", parseError)
                  debugMessages.push("Error al parsear JSON desde localStorage")
                }
              } else {
                console.log("No hay datos de clientes en localStorage")
                debugMessages.push("No hay datos de clientes en localStorage")
              }
            }
          } catch (storageError) {
            console.warn("Error al acceder a localStorage:", storageError)
            debugMessages.push("Error al acceder a localStorage")
          }
        }

        // Si encontramos clientes, ordenarlos por fecha
        if (foundClients.length > 0) {
          // Asegurarse de que todos los clientes tienen createdAt
          const clientsWithDates = foundClients.map((client) => ({
            ...client,
            createdAt: client.createdAt || new Date().toISOString(),
            status: client.status || "pending",
          }))

          // Ordenar por fecha más reciente primero
          const sortedClients = [...clientsWithDates].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime() || 0
            const dateB = new Date(b.createdAt).getTime() || 0
            return dateB - dateA
          })

          if (isMounted) {
            setClients(sortedClients)
            setFilteredClients(sortedClients)
            debugMessages.push(`Mostrando ${sortedClients.length} clientes reales`)
          }
        } else {
          // Si no hay datos en ninguna fuente, mostrar mensaje pero no cargar datos de ejemplo automáticamente
          console.log("No se encontraron clientes en ninguna fuente")
          debugMessages.push("No se encontraron clientes en ninguna fuente")

          if (isMounted) {
            setClients([])
            setFilteredClients([])
          }

          // Si hubo un error con Pinata, mostrarlo
          if (pinataError) {
            setError("Error al conectar con Pinata DB. Verifica tu conexión e inténtalo de nuevo.")
          }
        }

        // Actualizar debugInfo una sola vez al final
        if (isMounted) {
          setDebugInfo(debugMessages.join("\n"))
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error)
        let errorMessage = "Error general: "

        if (error instanceof Error) {
          console.error("Error message:", error.message)
          console.error("Error stack:", error.stack)
          errorMessage += error.message
        } else {
          console.error("Error no estándar:", JSON.stringify(error))
          errorMessage += JSON.stringify(error)
        }

        if (isMounted) {
          setDebugInfo(errorMessage)
          setError("No se pudieron cargar los clientes. Por favor, intenta de nuevo.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [refreshKey, pinataDBRef])

  // Aplicar filtros y búsqueda cuando cambian los criterios
  useEffect(() => {
    let result = [...clients]

    // Aplicar búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (client) =>
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.phone.toLowerCase().includes(searchLower) ||
          client.message.toLowerCase().includes(searchLower),
      )
    }

    // Aplicar filtro de estado
    if (statusFilter) {
      result = result.filter((client) => client.status === statusFilter)
    }

    // Aplicar filtro de fecha
    if (dateFilter) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      switch (dateFilter) {
        case "today":
          result = result.filter((client) => {
            const clientDate = new Date(client.createdAt)
            return clientDate >= today
          })
          break
        case "week":
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          result = result.filter((client) => {
            const clientDate = new Date(client.createdAt)
            return clientDate >= weekAgo
          })
          break
        case "month":
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          result = result.filter((client) => {
            const clientDate = new Date(client.createdAt)
            return clientDate >= monthAgo
          })
          break
      }
    }

    // Aplicar ordenación
    result.sort((a, b) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a[sortField]).getTime()
        const dateB = new Date(b[sortField]).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      } else {
        const valueA = a[sortField]?.toString().toLowerCase() || ""
        const valueB = b[sortField]?.toString().toLowerCase() || ""
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }
    })

    setFilteredClients(result)
  }, [clients, searchTerm, statusFilter, dateFilter, sortField, sortDirection])

  // Función para actualizar el estado de un cliente
  const updateClientStatus = useCallback(
    async (id: string, newStatus: string) => {
      try {
        // Actualizar en el estado local primero
        setClients((prevClients) =>
          prevClients.map((client) => (client.id === id ? { ...client, status: newStatus } : client)),
        )

        // Actualizar en Pinata DB
        try {
          const currentPinataDB = pinataDBRef.current
          if (currentPinataDB && typeof currentPinataDB.update === "function") {
            await currentPinataDB.update("clients", id, { status: newStatus })
            console.log(`Estado del cliente ${id} actualizado a ${newStatus} en Pinata DB`)
            toast.success(`Estado actualizado a ${newStatus}`)
          } else {
            console.warn("La función update de PinataDB no está disponible")
            toast.warning("No se pudo actualizar en la base de datos remota")
          }
        } catch (pinataError) {
          console.warn("Error al actualizar en Pinata DB:", pinataError)
          toast.error("Error al actualizar en la base de datos remota")
        }

        // Actualizar también en localStorage (formato antiguo) para compatibilidad
        try {
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
        } catch (storageError) {
          console.warn("Error al actualizar en localStorage:", storageError)
        }
      } catch (error) {
        console.error("Error al actualizar estado del cliente:", error)
        toast.error("Error al actualizar estado del cliente")
      }
    },
    [pinataDBRef],
  )

  // Función para eliminar un cliente
  const deleteClient = useCallback(
    async (id: string) => {
      try {
        // Eliminar de Pinata DB
        try {
          const currentPinataDB = pinataDBRef.current
          if (currentPinataDB && typeof currentPinataDB.remove === "function") {
            await currentPinataDB.remove("clients", id)
            console.log(`Cliente ${id} eliminado de Pinata DB`)
            toast.success("Cliente eliminado correctamente")
          } else {
            console.warn("La función remove de PinataDB no está disponible")
            toast.warning("No se pudo eliminar de la base de datos remota")
          }
        } catch (pinataError) {
          console.warn("Error al eliminar de Pinata DB:", pinataError)
          toast.error("Error al eliminar de la base de datos remota")
        }

        // Eliminar de localStorage
        try {
          const storedClients = localStorage.getItem("tattoo_clients")
          if (storedClients) {
            const parsedClients = JSON.parse(storedClients)
            if (Array.isArray(parsedClients)) {
              const updatedClients = parsedClients.filter((client: Client) => client.id !== id)
              localStorage.setItem("tattoo_clients", JSON.stringify(updatedClients))
            }
          }
        } catch (storageError) {
          console.warn("Error al eliminar de localStorage:", storageError)
        }

        // Actualizar estado local
        setClients((prevClients) => prevClients.filter((client) => client.id !== id))
        setClientToDelete(null)
        setDeleteConfirmOpen(false)
      } catch (error) {
        console.error("Error al eliminar cliente:", error)
        toast.error("Error al eliminar cliente")
      }
    },
    [pinataDBRef],
  )

  // Cargar datos de ejemplo
  const loadMockData = useCallback(() => {
    setClients([...MOCK_CLIENTS])
    setFilteredClients([...MOCK_CLIENTS])
    setShowMockData(true)
    setDebugInfo("Cargados datos de ejemplo")
  }, [])

  // Función para exportar a CSV
  const exportToCSV = useCallback(() => {
    try {
      // Crear cabeceras CSV
      const headers = ["ID", "Nombre", "Email", "Teléfono", "Mensaje", "Fecha", "Estado"]

      // Convertir datos a filas CSV
      const rows = filteredClients.map((client) => [
        client.id,
        client.name,
        client.email,
        client.phone,
        client.message.replace(/"/g, '""'), // Escapar comillas dobles
        formatDate(client.createdAt),
        client.status || "pending",
      ])

      // Combinar cabeceras y filas
      const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `clientes_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Datos exportados correctamente")
    } catch (error) {
      console.error("Error al exportar datos:", error)
      toast.error("Error al exportar datos")
    }
  }, [filteredClients])

  // Renderizado condicional para estados de carga y error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Función para manejar el cierre del diálogo
  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) setSelectedClient(null)
  }, [])

  // Estadísticas de clientes
  const totalClients = clients.length
  const pendingClients = clients.filter((c) => c.status === "pending").length
  const contactedClients = clients.filter((c) => c.status === "contacted").length
  const completedClients = clients.filter((c) => c.status === "completed").length

  return (
    <Tabs defaultValue="list" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50" : ""}
          >
            <Clock className="h-4 w-4 mr-2" />
            {autoRefresh ? "Auto-actualización ON" : "Auto-actualización OFF"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {debugInfo && (
        <Alert className="mb-4 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Información de depuración</AlertTitle>
          <AlertDescription>
            <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={handleRefresh}>
              Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showMockData && (
        <Alert className="mb-4 bg-blue-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Datos de ejemplo</AlertTitle>
          <AlertDescription>
            Estás viendo datos de ejemplo. Para ver clientes reales, haz clic en "Actualizar".
          </AlertDescription>
        </Alert>
      )}

      <TabsContent value="list">
        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, email, teléfono o mensaje..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <Select
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="contacted">Contactado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fecha</label>
                  <Select
                    value={dateFilter || ""}
                    onValueChange={(value) => setDateFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las fechas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las fechas</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Ordenar por</label>
                  <div className="flex gap-2">
                    <Select
                      value={sortField}
                      onValueChange={(value) => setSortField(value as keyof Client)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Fecha</SelectItem>
                        <SelectItem value="name">Nombre</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="status">Estado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    >
                      {sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredClients.length === 0 ? (
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
                  {filteredClients.map((client) => (
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Acciones
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updateClientStatus(client.id, "pending")}>
                                Marcar como Pendiente
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateClientStatus(client.id, "contacted")}>
                                Marcar como Contactado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateClientStatus(client.id, "completed")}>
                                Marcar como Completado
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  setClientToDelete(client.id)
                                  setDeleteConfirmOpen(true)
                                }}
                              >
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="stats">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {totalClients === 1 ? "cliente registrado" : "clientes registrados"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingClients}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((pendingClients / totalClients) * 100) || 0}% del total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contactados</CardTitle>
              <div className="h-4 w-4 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactedClients}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((contactedClients / totalClients) * 100) || 0}% del total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedClients}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedClients / totalClients) * 100) || 0}% del total
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Distribución de estados</CardTitle>
            <CardDescription>Porcentaje de clientes por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-end gap-2">
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-yellow-500 rounded-t-md" 
                  style={{ 
                    height: `${Math.max(5, Math.round((pendingClients / totalClients) * 100) || 0)}%`,
                    minHeight: '20px'
                  }}
                />
                <p className="text-sm mt-2">Pendientes</p>
                <p className="text-xs text-muted-foreground">{pendingClients}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-md" 
                  style={{ 
                    height: `${Math.max(5, Math.round((contactedClients / totalClients) * 100) || 0)}%`,
                    minHeight: '20px'
                  }}
                />
                <p className="text-sm mt-2">Contactados</p>
                <p className="text-xs text-muted-foreground">{contactedClients}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t-md" 
                  style={{ 
                    height: `${Math.max(5, Math.round((completedClients / totalClients) * 100) || 0)}%`,
                    minHeight: '20px'
                  }}
                />
                <p className="text-sm mt-2">Completados</p>
                <p className="text-xs text-muted-foreground">{completedClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={!!selectedClient} onOpenChange={handleDialogChange}>
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => clientToDelete && deleteClient(clientToDelete)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

