import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { messages } from "@/lib/schema"
import { getUserFromToken } from "@/lib/utils/auth"

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userMessages = await db.query.messages.findMany({
      where: (messages, { eq, or }) => or(eq(messages.senderId, user.id), eq(messages.receiverId, user.id)),
      orderBy: (messages, { desc }) => desc(messages.createdAt),
      with: {
        sender: true,
        receiver: true,
      },
    })

    return NextResponse.json({
      success: true,
      messages: userMessages,
    })
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { content, receiverId } = await request.json()

    if (!content || !receiverId) {
      return NextResponse.json({ error: "Contenido y destinatario son requeridos" }, { status: 400 })
    }

    const [message] = await db
      .insert(messages)
      .values({
        content,
        senderId: user.id,
        receiverId,
      })
      .returning()

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 })
  }
}

