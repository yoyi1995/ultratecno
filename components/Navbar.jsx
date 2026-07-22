'use client'

import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownPopover, 
  DropdownItem 
} from '@heroui/react'
import { 
  ChevronDown, 
  Laptop, 
  Printer, 
  Cpu, 
  ShieldCheck, 
  Plug, 
  Headphones, 
  Zap, 
  Lightbulb 
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import CartDropdown from '@/components/CartDropdown'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                UltraTecno
              </h1>
              <p className="text-xs text-gray-500">Más allá de la Tecnología</p>
            </div>
          </Link>

          {/* Centro: Botón Categorías + Menú Horizontal */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative z-50">
              <Dropdown>
                <DropdownTrigger>
                  <div
                    role="button"
                    tabIndex={0}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-full px-4 py-2 inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span className="text-white">Categorías</span>
                    <ChevronDown size={18} className="ml-2 text-white" />
                  </div>
                </DropdownTrigger>

                <DropdownPopover>
                  <DropdownMenu
                    className="bg-white text-slate-900 rounded-2xl shadow-xl ring-1 ring-slate-200"
                    aria-label="Categorías"
                    onAction={(key) => router.push(`/products?category=${key}`)}
                  >
                    <DropdownItem key="laptops">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Laptop size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">LAPTOPS</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="impresoras">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Printer size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">IMPRESORAS</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="electronica">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Cpu size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">ELECTRÓNICA</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="software">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <ShieldCheck size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">SOFTWARE Y ANTIVIRUS</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="cables">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Plug size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">CABLES Y ADAPTADORES</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="multimedia">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Headphones size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">MULTIMEDIA Y ACCESORIOS</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="proteccion">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Zap size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">PROTECCIÓN ELÉCTRICA</span>
                      </div>
                    </DropdownItem>

                    <DropdownItem key="consejos">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100">
                        <Lightbulb size={18} className="text-blue-700" />
                        <span className="font-medium text-slate-900">CONSEJOS Y TIPS</span>
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </DropdownPopover>
              </Dropdown>
            </div>

            {/* PESTAÑAS HORIZONTALES - estilo uniforme */}
            <Link 
              href="/products" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                isActive('/products') 
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              TIENDA
            </Link>
            <Link 
              href="/mantenimiento" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                isActive('/mantenimiento') 
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              MANTENIMIENTO PREVENTIVO
            </Link>
            <Link 
              href="/reparaciones" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                isActive('/reparaciones') 
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              REPARACIONES
            </Link>
            <Link 
              href="/quienes-somos" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                isActive('/quienes-somos') 
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              QUIENES SOMOS
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                isActive('/contact') 
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              CONTACTO
            </Link>
            {/* Icono del carrito en el navbar - estilo uniforme */}
            <div className="px-1">
              <CartDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}