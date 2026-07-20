'use client'

import { Card, Button } from '@heroui/react'
import { Printer, Laptop, Cpu, Monitor, Wrench, DollarSign, Shield, Clock, MessageCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import CartDropdown from '@/components/CartDropdown'

// Página de REPARACIONES
// Muestra servicios de reparación profesional
export default function ReparacionesPage() {
  // Número de WhatsApp para contacto
  const phoneNumber = '593995709352'

  // Generar URL de WhatsApp con mensaje pre-llenado
  const getWhatsAppUrl = (servicio: string) => {
    const message = `¡Hola! Necesito reparación de ${servicio}`
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }

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
              <Link href="/mantenimiento" className="px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm">
                MANTENIMIENTO
              </Link>
              <Link href="/reparaciones" className="px-3 py-2 text-blue-700 font-semibold rounded-lg text-sm">
                REPARACIONES
              </Link>
              <Link href="/quienes-somos" className="px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Reparación profesional en electrónica
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Solucionamos cualquier problema técnico de tus equipos con garantía y calidad
          </p>
          <a href={getWhatsAppUrl('equipo electrónico')} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2 px-8"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Solicitar servicio por WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestros servicios de reparación
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Impresoras */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Printer className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">Impresoras</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Cambio de cartuchos/tóner
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Reparación de cabezales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Solución de errores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Configuración de red
                  </li>
                </ul>
                <a href={getWhatsAppUrl('impresora')} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* Laptops */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Laptop className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">Laptops</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Cambio de pantallas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Reparación de teclados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Solución de sobrecalentamiento
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Recuperación de datos
                  </li>
                </ul>
                <a href={getWhatsAppUrl('laptop')} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* PCs / Escritorio */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cpu className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">PCs / Escritorio</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Diagnóstico completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Reparación de motherboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Cambio de fuentes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Actualización de componentes
                  </li>
                </ul>
                <a href={getWhatsAppUrl('computadora de escritorio')} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* TVs / Monitores */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">TVs / Monitores</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Reparación de pantallas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Solución de imagen
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Reparación de audio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Conexiones HDMI/USB
                  </li>
                </ul>
                <a href={getWhatsAppUrl('televisor o monitor')} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* Otros */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">Otros equipos</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Consolas de videojuegos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Audio y equipos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Fuentes de poder
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Periféricos
                  </li>
                </ul>
                <a href={getWhatsAppUrl('otro equipo')} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ¿Por qué UltraTecno? */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué UltraTecno?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <DollarSign className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Diagnóstico gratis</h3>
              <p className="text-gray-600 text-sm">Evaluación sin costo previo</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <Shield className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Garantía en reparaciones</h3>
              <p className="text-gray-600 text-sm">Hasta 90 días en piezas y mano de obra</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <Cpu className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Técnicos certificados</h3>
              <p className="text-gray-600 text-sm">Profesionales con experiencia</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <Clock className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Entrega rápida</h3>
              <p className="text-gray-600 text-sm">24-48 horas según disponibilidad</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Escríbenos por WhatsApp', desc: 'Describe el problema de tu equipo' },
              { num: '2', title: 'Cuéntanos el problema', desc: 'Te damos diagnóstico y presupuesto' },
              { num: '3', title: 'Te damos presupuesto', desc: 'Confirmas el servicio' },
              { num: '4', title: 'Reparamos y entregamos', desc: 'Con garantía y reporte' }
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Tu equipo necesita reparación?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contáctanos ahora y obtén atención personalizada
          </p>
          <a href={getWhatsAppUrl('equipo electrónico')} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2 px-8"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactar ahora
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}