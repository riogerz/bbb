import { ClientsDashboard } from "@/components/admin/clients-dashboard"

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Clientes</h1>
      <ClientsDashboard />
    </div>
  )
}

