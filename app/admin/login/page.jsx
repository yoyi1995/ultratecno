'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Input, Card } from '@heroui/react'
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/admin')
    } catch (error) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900">
      {/* Fondo animado con círculos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Tarjeta de login */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-0">
        <div className="p-8">
          {/* Logo y título */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-xl transform hover:scale-110 transition-transform duration-300">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent mb-2">
              UltraTecno
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Panel de Administración
              <Sparkles className="w-4 h-4 text-blue-500" />
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm animate-pulse">
                <strong>⚠ Error:</strong> {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="admin@ultratecno.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
                size="lg"
                className={{
                  input: "text-base",
                  inputWrapper: "h-12 hover:border-blue-500 transition-colors"
                }}
                isRequired
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-base",
                  inputWrapper: "h-12 hover:border-blue-500 transition-colors"
                }}
                isRequired
              />
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={loading}
              className="mt-4 h-12 text-lg font-semibold bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              🔒 Acceso seguro y encriptado
            </p>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              © 2026 UltraTecno - Todos los derechos reservados
            </p>
          </div>
        </div>
      </Card>

      {/* Decoración inferior */}
      <div className="absolute bottom-4 text-white/60 text-xs text-center z-10">
        <p>Sistema de Gestión de Tienda Virtual</p>
      </div>
    </div>
  )
}