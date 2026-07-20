'use client'

import { Card, Button } from '@heroui/react'
import { Shield, Award, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import CartDropdown from '@/components/CartDropdown'

// Página de QUIENES SOMOS
// Muestra información sobre la empresa y sus valores
export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  UltraTecno
                </h1>
                <p className="text-xs text-gray-500">Más allá de la Tecnología</p>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/" className="px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm">
                Inicio
              </Link>
              <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm">
                TIENDA
              </Link>
              <Link href="/quienes-somos" className="px-3 py-2 text-blue-700 font-semibold rounded-lg text-sm">
                QUIENES SOMOS
              </Link>
              <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm">
                CONTACTO
              </Link>
              <div className="px-1">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-2">¿Quiénes Somos?</h1>
          <p className="text-blue-100 text-lg">Conoce más sobre UltraTecno</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  En <strong className="text-blue-700">UltraTecno</strong> somos una empresa especializada en servicios técnicos 
                  para equipos tecnológicos, comprometida con ofrecer soluciones rápidas, confiables y de alta calidad. 
                  Contamos con personal capacitado y herramientas especializadas para diagnosticar, reparar y dar mantenimiento 
                  a una amplia variedad de dispositivos.
                </p>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Nuestra experiencia abarca el servicio técnico de computadoras de escritorio, laptops, impresoras, 
                  equipos electrónicos y sistemas de electrónica avanzada, brindando atención tanto a clientes particulares 
                  como a empresas.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Nos enfocamos en ofrecer un servicio transparente, utilizando repuestos de calidad y aplicando procedimientos 
                  técnicos que garantizan el correcto funcionamiento y la mayor vida útil de los equipos.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra misión</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Brindar soluciones tecnológicas eficientes mediante un servicio técnico profesional, confiable y oportuno, 
                  superando las expectativas de nuestros clientes con calidad, responsabilidad e innovación.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra visión</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Ser una empresa líder en servicios técnicos y soluciones tecnológicas, reconocida por la excelencia en el 
                  servicio, la innovación constante y la confianza que depositan nuestros clientes.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestros valores</h2>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Responsabilidad:</strong> Cumplimos con cada servicio de forma profesional.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Honestidad:</strong> Diagnósticos claros y presupuestos transparentes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Calidad:</strong> Trabajamos con altos estándares técnicos y materiales de confianza.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                    <span className="text-gray-700"><strong>Compromiso:</strong> Buscamos siempre la mejor solución para cada cliente.</span>
                  </li>
                </ul>

                <p className="text-gray-700 text-lg leading-relaxed">
                  En <strong className="text-blue-700">UltraTecno</strong>, más que reparar equipos, ayudamos a que la tecnología 
                  siga funcionando de manera eficiente para que nuestros clientes puedan continuar con sus actividades sin preocupaciones.
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de contacto */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contáctanos</h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Dirección:</strong> 10 de Agosto y 8va norte, Frente a la Ferretería Armijos, Machala, Ecuador
                </p>
                <p className="text-gray-600">
                  <strong>Horario:</strong> Lun - Vie: 8:30 - 18:00 | Sáb: 8:30 - 18:00
                </p>
                <Link href="/contact">
                  <Button className="w-full bg-blue-700 text-white rounded-xl">
                    Ir a Contacto
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Servicios destacados */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-700 rounded-full"></span>
                  Reparación de Laptops
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-700 rounded-full"></span>
                  Reparación de Impresoras
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-700 rounded-full"></span>
                  Mantenimiento Preventivo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-700 rounded-full"></span>
                  Venta de Repuestos
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}