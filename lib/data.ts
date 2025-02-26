import { cache } from "react"
import type { DashboardStats } from "@/types"

// Cache the data fetching functions
export const getClients = cache(async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return MOCK_CLIENTS
})

export const getClientCount = cache(async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return MOCK_CLIENTS.length
})

export const getDashboardStats = cache(async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    totalClients: MOCK_CLIENTS.length,
    newClientsThisMonth: Math.floor(MOCK_CLIENTS.length * 0.2),
    appointmentsThisMonth: 45,
    appointmentsChange: "+8.2%",
    newMessages: 12,
    messagesChange: "+5.1%",
    monthlyRevenue: 12450,
    revenueChange: "+15.3%",
  } satisfies DashboardStats
})

export const getRecentActivity = cache(async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  return MOCK_RECENT_ACTIVITY
})

// Mock data
const MOCK_CLIENTS = [
  {
    id: 1,
    name: "María García",
    email: "maria@example.com",
    phone: "+1234567890",
    message: "Interesada en un tatuaje de estilo realista",
    status: "pending",
    createdAt: "2024-02-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+0987654321",
    message: "Consulta sobre cover up",
    status: "contacted",
    createdAt: "2024-02-19T15:30:00Z",
  },
  {
    id: 3,
    name: "Ana López",
    email: "ana@example.com",
    phone: "+1122334455",
    message: "Consulta sobre diseño personalizado",
    status: "pending",
    createdAt: "2024-02-18T09:15:00Z",
  },
] as const

const MOCK_RECENT_ACTIVITY = [
  {
    id: 1,
    type: "new_client",
    client: MOCK_CLIENTS[0],
    timestamp: "2024-02-20T10:00:00Z",
  },
  {
    id: 2,
    type: "appointment_scheduled",
    client: MOCK_CLIENTS[1],
    timestamp: "2024-02-19T15:30:00Z",
    appointmentDate: "2024-03-01T14:00:00Z",
  },
  {
    id: 3,
    type: "message_received",
    client: MOCK_CLIENTS[2],
    timestamp: "2024-02-18T09:15:00Z",
    message: "¿Cuándo podría agendar una cita?",
  },
] as const

