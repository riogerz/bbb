"use client"

import { useEffect } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminDirectPage() {
  // Establecer una marca en sessionStorage para indicar que estamos autenticados
  useEffect(() => {
    sessionStorage.setItem("admin_authenticated", "true")
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-yellow-500 text-black p-4 text-center">
        <p className="font-bold">ACCESO DIRECTO AL PANEL DE ADMINISTRACIÓN (SOLO DESARROLLO)</p>
        <p className="text-sm">Esta ruta permite acceso sin autenticación y debe eliminarse en producción</p>
      </div>

      <AdminDashboard />
    </div>
  )
}

