import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminSession } from "@/lib/auth/admin"

export async function middleware(request: NextRequest) {
  // Proteger rutas de administrador
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // No proteger la página de login
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    const isAuthenticated = await verifyAdminSession()

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}

