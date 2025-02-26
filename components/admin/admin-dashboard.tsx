"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientsList } from "@/components/admin/clients-list"
import { MessagesList } from "@/components/admin/messages-list"
import { AdminHeader } from "@/components/admin/admin-header"
import { StorageSection } from "@/components/admin/storage-section"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("clients")

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <main className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
            <TabsTrigger value="storage">Almacenamiento</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ClientsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensajes</CardTitle>
              </CardHeader>
              <CardContent>
                <MessagesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle>Almacenamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <StorageSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

