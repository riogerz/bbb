import type { Metadata } from "next"
import { UserProfile } from "@/components/user/profile"
import { getUserFromToken } from "@/lib/utils/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Perfil de Usuario",
  description: "Gestiona tu perfil y mensajes",
}

export default async function ProfilePage() {
  const user = await getUserFromToken()

  if (!user) {
    redirect("/login")
  }

  return <UserProfile user={user} />
}

