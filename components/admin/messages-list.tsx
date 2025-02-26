"use client"

import { useState, useEffect, useCallback } from "react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, MessageSquare, Send, RefreshCw, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { pinataDB, usePinataDB } from "@/lib/pinata-db"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Message {
  id: number | string
  content: string
  sender: "user" | "admin"
  timestamp: string
  userName?: string
  userEmail?: string
}

// Datos de ejemplo para desarrollo
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    userName: "María García",
    userEmail: "maria@example.com",
    content: "Hola, me gustaría saber los precios para un tatuaje pequeño en el brazo.",
    timestamp: "2024-02-22T14:30:00Z",
    sender: "user",
  },
  {
    id: "2",
    userName: "Juan Pérez",
    userEmail: "juan@example.com",
    content: "Buenas tardes, ¿tienen disponibilidad para la próxima semana?",
    timestamp: "2024-02-21T10:15:00Z",
    sender: "user",
  },
  {
    id: "3",
    userName: "Ana López",
    userEmail: "ana@example.com",
    content: "Me interesa un diseño personalizado. ¿Podríamos agendar una consulta?",
    timestamp: "2024-02-20T16:45:00Z",
    sender: "user",
  },
]

export function MessagesList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Message[] | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null)
  const { toast } = useToast()

  // Inicializar pinataDB con el toast
  usePinataDB()

  // Probar la conexión con Pinata
  const testPinataConnection = useCallback(async () => {
    try {
      const result = await pinataDB.testConnection()
      setConnectionStatus(result)
      return result.success
    } catch (error) {
      console.error("Error al probar la conexión con Pinata:", error)
      setConnectionStatus({
        success: false,
        message: `Error al conectar con Pinata: ${error instanceof Error ? error.message : String(error)}`,
      })
      return false
    }
  }, [])

  // Función para cargar mensajes desde Pinata DB y localStorage
  const loadMessages = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsLoading(true)
        setError(null)
        const debugMessages: string[] = []

        // Si no estamos forzando la actualización, intentamos cargar desde localStorage primero
        if (!forceRefresh) {
          try {
            const storedMessages = localStorage.getItem("tattoo_contact_messages")
            if (storedMessages) {
              const parsedMessages = JSON.parse(storedMessages)
              if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                debugMessages.push(`✅ Cargados ${parsedMessages.length} mensajes desde localStorage`)
                setMessages(parsedMessages)
                setDebugInfo(debugMessages)
                setIsLoading(false)
                return
              }
            }
            debugMessages.push("⚠️ No se encontraron mensajes en localStorage")
          } catch (storageError) {
            debugMessages.push(`❌ Error al cargar desde localStorage: ${storageError}`)
            console.warn("Error loading messages from localStorage:", storageError)
          }
        } else {
          debugMessages.push("🔄 Forzando actualización desde Pinata DB")
        }

        // Probar la conexión con Pinata antes de intentar cargar datos
        const connectionOk = await testPinataConnection()
        if (!connectionOk) {
          debugMessages.push("❌ No se pudo conectar con Pinata DB")
          throw new Error("No se pudo establecer conexión con Pinata DB")
        }

        // Intentar cargar desde Pinata DB
        try {
          debugMessages.push("🔍 Buscando mensajes en Pinata DB...")
          const contactSubmissions = await pinataDB.find("contact_submission")

          // Validamos que la respuesta sea un array y tenga elementos
          if (contactSubmissions && Array.isArray(contactSubmissions) && contactSubmissions.length > 0) {
            debugMessages.push(`✅ Encontrados ${contactSubmissions.length} mensajes en Pinata DB`)

            // Convertir los registros de Pinata DB al formato de mensajes
            const formattedMessages: Message[] = contactSubmissions.map((record) => ({
              id: record.id,
              content: record.data.message || "Sin mensaje",
              sender: "user",
              timestamp: record.createdAt,
              userName: record.data.name || "Usuario sin nombre",
              userEmail: record.data.email || "Email no disponible",
            }))

            // Cargar también las respuestas guardadas en localStorage
            try {
              const storedReplies = localStorage.getItem("tattoo_admin_replies")
              if (storedReplies) {
                const parsedReplies = JSON.parse(storedReplies)
                if (Array.isArray(parsedReplies) && parsedReplies.length > 0) {
                  debugMessages.push(`✅ Cargadas ${parsedReplies.length} respuestas desde localStorage`)
                  formattedMessages.push(...parsedReplies)
                }
              }
            } catch (repliesError) {
              debugMessages.push(`⚠️ Error al cargar respuestas: ${repliesError}`)
            }

            // Guardar en localStorage para acceso rápido
            localStorage.setItem("tattoo_contact_messages", JSON.stringify(formattedMessages))

            setMessages(formattedMessages)
            setDebugInfo(debugMessages)
            setIsLoading(false)
            return
          } else {
            debugMessages.push("⚠️ No se encontraron mensajes en Pinata DB")
          }
        } catch (pinataError) {
          debugMessages.push(`❌ Error al cargar desde Pinata DB: ${pinataError}`)
          console.error("Error loading messages from Pinata DB:", pinataError)
        }

        // Si no hay datos en Pinata DB ni localStorage, usar datos de ejemplo
        debugMessages.push("ℹ️ Usando datos de ejemplo")
        setMessages(MOCK_MESSAGES)
        localStorage.setItem("tattoo_contact_messages", JSON.stringify(MOCK_MESSAGES))
        setDebugInfo(debugMessages)
      } catch (error) {
        console.error("Error loading messages:", error)
        setError(`No se pudieron cargar los mensajes: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [testPinataConnection],
  )

  // Cargar mensajes al montar el componente
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Función para refrescar los mensajes desde Pinata DB
  const handleRefresh = () => {
    setIsRefreshing(true)
    loadMessages(true)
  }

  // Agrupar mensajes por usuario para mostrar conversaciones
  const groupedMessages = messages.reduce((acc: Record<string, Message[]>, message) => {
    const userKey = message.userName || "Usuario anónimo"
    if (!acc[userKey]) {
      acc[userKey] = []
    }
    acc[userKey].push(message)
    return acc
  }, {})

  // Obtener el último mensaje de cada conversación para mostrar en la lista
  const conversations = Object.entries(groupedMessages).map(([userName, msgs]) => {
    const latestMessage = msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

    return {
      userName,
      latestMessage,
      unreadCount: msgs.filter((m) => m.sender === "user").length,
      email: msgs[0].userEmail || "No disponible",
    }
  })

  const viewConversation = (userName: string) => {
    setSelectedUser(userName)
    setSelectedConversation(groupedMessages[userName])
  }

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedUser) return

    setIsSending(true)

    try {
      // Crear mensaje de respuesta
      const newReply: Message = {
        id: `admin_reply_${Date.now()}`,
        content: replyText,
        sender: "admin",
        timestamp: new Date().toISOString(),
        userName: "Admin",
      }

      // Actualizar estado local
      const updatedConversation = [...(selectedConversation || []), newReply]
      setSelectedConversation(updatedConversation)

      // Actualizar estado global de mensajes
      const updatedMessages = [...messages, newReply]
      setMessages(updatedMessages)

      // Guardar en localStorage
      try {
        localStorage.setItem("tattoo_contact_messages", JSON.stringify(updatedMessages))

        // Guardar respuestas del admin por separado
        const storedReplies = localStorage.getItem("tattoo_admin_replies")
        const existingReplies = storedReplies ? JSON.parse(storedReplies) : []
        localStorage.setItem("tattoo_admin_replies", JSON.stringify([...existingReplies, newReply]))
      } catch (storageError) {
        console.warn("Error saving reply to localStorage:", storageError)
      }

      // Limpiar campo de respuesta
      setReplyText("")

      toast({
        title: "Respuesta enviada",
        description: "Tu mensaje ha sido enviado al cliente.",
      })
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la respuesta. Inténtalo de nuevo.",
      })
    } finally {
      setIsSending(false)
    }
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
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="mt-4" onClick={() => testPinataConnection()}>
            Probar conexión
          </Button>
          <Button variant="outline" className="mt-4" onClick={() => loadMessages(true)}>
            Reintentar
          </Button>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setMessages(MOCK_MESSAGES)
              setError(null)
            }}
          >
            Cargar datos de ejemplo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mensajes de clientes</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Actualizar
        </Button>
      </div>

      {connectionStatus && (
        <Alert variant={connectionStatus.success ? "default" : "destructive"} className="mb-4">
          <AlertTitle>Estado de conexión con Pinata</AlertTitle>
          <AlertDescription>{connectionStatus.message}</AlertDescription>
        </Alert>
      )}

      {debugInfo.length > 0 && (
        <div className="mb-4 p-2 bg-zinc-800/50 rounded-md text-xs">
          <div className="font-semibold mb-1">Información de depuración:</div>
          {debugInfo.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}

      <div className="space-y-4 h-[500px] overflow-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-12 w-12 text-zinc-500 mb-4" />
            <p className="text-zinc-500">No hay mensajes disponibles</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Card
              key={conversation.userName}
              className="p-4 hover:bg-zinc-800/50 cursor-pointer transition-colors"
              onClick={() => viewConversation(conversation.userName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{conversation.userName}</h3>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="bg-blue-600">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">{conversation.email}</p>
                </div>
                <span className="text-sm text-zinc-400">{formatDate(conversation.latestMessage.timestamp)}</span>
              </div>
              <p className="mt-2 text-zinc-300 line-clamp-2">{conversation.latestMessage.content}</p>
            </Card>
          ))
        )}
      </div>

      {/* Diálogo para ver la conversación completa y responder */}
      <Dialog
        open={!!selectedConversation}
        onOpenChange={() => {
          setSelectedConversation(null)
          setReplyText("")
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conversación con {selectedUser}</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] overflow-auto pr-4">
            <div className="flex flex-col gap-3">
              {selectedConversation?.map((message) => (
                <div
                  key={message.id}
                  className={`flex max-w-[80%] flex-col rounded-lg px-3 py-2 ${
                    message.sender === "user" ? "mr-auto bg-zinc-800 text-zinc-100" : "ml-auto bg-blue-600 text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="mt-1 text-xs opacity-70">{new Date(message.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Campo de respuesta */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Escribe tu respuesta..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && replyText.trim()) {
                  e.preventDefault()
                  handleSendReply()
                }
              }}
            />
            <Button onClick={handleSendReply} disabled={!replyText.trim() || isSending}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

