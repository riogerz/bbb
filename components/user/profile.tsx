"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { User, Message } from "@/lib/schema"

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages")
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los mensajes",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: 1, // ID del administrador
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMessages((prev) => [data.message, ...prev])
        setNewMessage("")
        toast({
          title: "Mensaje enviado",
          description: "Tu mensaje ha sido enviado correctamente",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Perfil */}
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Nombre</label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Teléfono</label>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensajes */}
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle>Mensajes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-[400px] rounded-md border border-zinc-800 p-4">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-zinc-400">No hay mensajes aún</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.senderId === user.id ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-200"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="mt-1 text-xs opacity-70">{new Date(message.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 border-zinc-800 bg-zinc-800/50"
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="ml-2">Enviar</span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

