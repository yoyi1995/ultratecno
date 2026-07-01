'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  Button, 
  Avatar, 
  Chip
} from '@heroui/react'
import { 
  Package, 
  BookOpen, 
  LogOut, 
  TrendingUp, 
  Users,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Eye,
  ArrowUpRight
} from 'lucide-react'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    products: 0,
    courses: 0,
    inStock: 0,
    outOfStock: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/admin/login')
      } else {
        setUser(user)
        await fetchStats()
      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  const fetchStats = async () => {
    // Contar productos totales
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Contar productos en stock
    const { count: inStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', true)

    // Contar productos agotados
    const { count: outOfStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', false)

    // Contar cursos
    const { count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    setStats({
      products: productsCount || 0,
      courses: coursesCount || 0,
      inStock: inStockCount || 0,
      outOfStock: outOfStockCount || 0,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  const menuItems = [
    { icon: Package, label: 'Productos', href: '/admin/products', color: 'primary' },
    { icon: BookOpen, label: 'Cursos', href: '/admin/courses', color: 'secondary' },
    { icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders', color: 'success' },
    { icon: Users, label: 'Clientes', href: '/admin/customers', color: 'warning' },
    { icon: Settings, label: 'Configuración', href: '/admin/settings', color: 'default' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    UltraTecno
                  </h1>
                  <p className="text-xs text-gray-500">Panel de Control</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Chip 
                color="success" 
                variant="soft"
                size="sm"
                className="hidden sm:flex"
              >
                En línea
              </Chip>
              <Avatar 
                src={user?.user_metadata?.avatar_url}
                name={user?.email?.split('@')[0]}
                className="w-10 h-10"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`
            lg:w-64 transition-all duration-300
            ${sidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            <Card className="bg-white/60 backdrop-blur-lg border border-gray-200">
              <div className="p-4">
                <div className="flex flex-col gap-2">
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`justify-start h-12 ${item.color === 'primary' ? 'text-blue-700 hover:bg-blue-50' : item.color === 'secondary' ? 'text-purple-700 hover:bg-purple-50' : item.color === 'success' ? 'text-green-700 hover:bg-green-50' : item.color === 'warning' ? 'text-amber-700 hover:bg-amber-50' : 'text-slate-700 hover:bg-slate-100'}`}
                      onPress={() => router.push(item.href)}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Button>
                  ))}
                </div>

                <div className="my-4 border-t border-gray-200"></div>

                <div className="p-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl text-white">
                  <p className="text-sm font-semibold mb-1">Plan Gratuito</p>
                  <p className="text-xs opacity-80">25 GB disponibles</p>
                  <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                ¡Bienvenido de vuelta! 👋
              </h2>
              <p className="text-gray-600">
                {user?.email?.split('@')[0]} - Aquí está el resumen de tu tienda
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {/* Total Productos */}
              <Card 
                className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                isPressable
                onPress={() => router.push('/admin/products')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-white/70" />
                  </div>
                  <p className="text-blue-100 text-sm mb-1">Total Productos</p>
                  <p className="text-3xl font-bold">{stats.products}</p>
                </div>
              </Card>

              {/* En Stock */}
              <Card 
                className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                isPressable
                onPress={() => router.push('/admin/products')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Eye size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-white/70" />
                  </div>
                  <p className="text-green-100 text-sm mb-1">En Stock</p>
                  <p className="text-3xl font-bold">{stats.inStock}</p>
                </div>
              </Card>

              {/* Agotados */}
              <Card 
                className="bg-gradient-to-br from-red-500 to-red-700 text-white border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                isPressable
                onPress={() => router.push('/admin/products')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-white/70" />
                  </div>
                  <p className="text-red-100 text-sm mb-1">Agotados</p>
                  <p className="text-3xl font-bold">{stats.outOfStock}</p>
                </div>
              </Card>

              {/* Cursos */}
              <Card 
                className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                isPressable
                onPress={() => router.push('/admin/courses')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <ArrowUpRight size={20} className="text-white/70" />
                  </div>
                  <p className="text-purple-100 text-sm mb-1">Cursos Activos</p>
                  <p className="text-3xl font-bold">{stats.courses}</p>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/60 backdrop-blur-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Acciones Rápidas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Button
  variant="primary"
  size="lg"
  className="h-14 text-lg text-white bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 shadow-lg rounded-xl inline-flex items-center justify-center gap-2"
  onPress={() => router.push('/admin/products/new')}
>
  <Package size={20} />
  Agregar Producto
</Button>
<Button
  variant="secondary"
  size="lg"
  className="h-14 text-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg rounded-xl inline-flex items-center justify-center gap-2"
  onPress={() => router.push('/admin/courses/new')}
>
  <BookOpen size={20} />
  Crear Curso
</Button>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}