"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X, Loader2, MinimizeIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  content: string
  sender: "user" | "admin"
  timestamp: Date
}

interface ChatWidgetProps {
  userName: string
  onClose: () => void
  isOpen: boolean
}

export function ChatWidget({ userName, onClose, isOpen }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Cargar mensajes existentes al abrir el chat
  useEffect(() => {
    if (isOpen) {
      loadExistingMessages()

      // Si no hay mensajes previos, enviar mensaje inicial
      if (messages.length === 0) {
        const initialMessage = {
          id: Date.now(),
          content: `¡Hola ${userName || "visitante"}! Gracias por contactarnos. ¿En qué puedo ayudarte?`,
          sender: "admin" as const,
          timestamp: new Date(),
        }
        setMessages([initialMessage])
        saveMessageToLocalStorage(initialMessage)
      }
    }
  }, [isOpen, userName, messages.length])

  // Cargar mensajes existentes desde localStorage
  const loadExistingMessages = () => {
    try {
      const storedMessages = localStorage.getItem("tattoo_chat_messages")
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages)

        // Filtrar mensajes para este usuario específico
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          const userMessages = parsedMessages.filter(
            (msg: any) =>
              msg.userName === userName ||
              (msg.sender === "admin" && !msg.userName) ||
              msg.userEmail === localStorage.getItem("tattoo_user_email"),
          )

          // Convertir timestamps de string a Date
          const formattedMessages = userMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            id: msg.id || Date.now() + Math.random(),
          }))

          if (formattedMessages.length > 0) {
            setMessages(formattedMessages)
          }
        }
      }
    } catch (error) {
      console.warn("Error al cargar mensajes del chat:", error)
    }
  }

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  // Función para guardar mensajes en localStorage
  const saveMessageToLocalStorage = (message: Message) => {
    try {
      // Obtener mensajes existentes
      const storedMessages = localStorage.getItem("tattoo_chat_messages") || "[]"
      const existingMessages = JSON.parse(storedMessages)

      // Agregar el nuevo mensaje con información del usuario
      const messageToStore = {
        ...message,
        userName: userName || "Usuario anónimo",
        userEmail: localStorage.getItem("tattoo_user_email") || "No disponible",
        timestamp: message.timestamp.toISOString(),
      }

      // Guardar la lista actualizada
      localStorage.setItem("tattoo_chat_messages", JSON.stringify([...existingMessages, messageToStore]))
    } catch (error) {
      console.warn("Error al guardar mensaje en localStorage:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      content: newMessage,
      sender: "user" as const,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Guardar mensaje del usuario en localStorage
    saveMessageToLocalStorage(userMessage)

    // Simular respuesta del administrador después de un breve delay
    setTimeout(() => {
      const adminResponse = {
        id: Date.now() + 1,
        content: "Gracias por tu mensaje. Un administrador te responderá en breve.",
        sender: "admin" as const,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, adminResponse])

      // Guardar respuesta del administrador en localStorage
      saveMessageToLocalStorage(adminResponse)

      setIsSending(false)
    }, 1000)
  }

  // Verificar si hay respuestas del administrador
  useEffect(() => {
    if (!isOpen) return

    const checkForNewMessages = () => {
      try {
        const storedMessages = localStorage.getItem("tattoo_chat_messages")
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages)

          // Buscar mensajes nuevos del administrador
          if (Array.isArray(parsedMessages)) {
            const adminMessages = parsedMessages.filter(
              (msg: any) =>
                msg.sender === "admin" &&
                msg.timestamp &&
                // Verificar si es para este usuario
                (msg.userEmail === localStorage.getItem("tattoo_user_email") || !msg.userEmail),
            )

            // Verificar si hay mensajes nuevos que no estén ya en el estado
            const currentIds = messages.map((m) => m.id)
            const newAdminMessages = adminMessages.filter((msg: any) => !currentIds.includes(msg.id))

            if (newAdminMessages.length > 0) {
              // Agregar nuevos mensajes al estado
              const formattedNewMessages = newAdminMessages.map((msg: any) => ({
                id: msg.id || Date.now() + Math.random(),
                content: msg.content,
                sender: "admin",
                timestamp: new Date(msg.timestamp),
              }))

              setMessages((prev) => [...prev, ...formattedNewMessages])
            }
          }
        }
      } catch (error) {
        console.warn("Error al verificar nuevos mensajes:", error)
      }
    }

    // Verificar cada 5 segundos
    const interval = setInterval(checkForNewMessages, 5000)

    return () => clearInterval(interval)
  }, [isOpen, messages])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed right-0 z-50 w-80 transition-all duration-300 overflow-hidden translate-y-[-50%] top-1/2",
        isMinimized ? "h-12" : "h-[500px]",
      )}
    >
      <Card
        className="flex h-full flex-col text-white border-l border-t border-b border-white/10 rounded-l-2xl rounded-r-none shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          boxShadow: `
    -4px 0 6px -1px rgba(0, 0, 0, 0.1),
    -2px 0 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
  `,
        }}
      >
        <CardHeader className="border-b border-zinc-800 p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Chat con Soporte</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-zinc-800"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <MinimizeIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-zinc-800" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-3">
              <ScrollArea className="h-full pr-4" ref={scrollRef}>
                <div className="flex flex-col gap-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex max-w-[80%] flex-col rounded-lg px-3 py-2",
                        message.sender === "user"
                          ? "ml-auto bg-blue-600 text-white"
                          : "mr-auto bg-zinc-800 text-zinc-100",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="border-t border-zinc-800 p-3">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border-zinc-800 bg-zinc-800/50"
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSending || !newMessage.trim()}
                  className="h-9 w-9 bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

