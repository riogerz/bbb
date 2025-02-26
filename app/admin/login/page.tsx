import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <p className="mt-2 text-zinc-400">Inicia sesión para continuar</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

