'use client'

import { Card, Button, Accordion, AccordionItem } from '@heroui/react'
import { Shield, Zap, DollarSign, Clock, Laptop, Cpu, Printer, Gamepad2, Wrench, CheckCircle, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import CartDropdown from '@/components/CartDropdown'

// Página de MANTENIMIENTO PREVENTIVO
// Muestra servicios y beneficios del mantenimiento
export default function MantenimientoPage() {
  // Número de WhatsApp para contacto
  const phoneNumber = '593995709352'
  const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('¡Hola! Quiero agendar un servicio de mantenimiento preventivo.')}`

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
              <Link href="/mantenimiento" className="px-3 py-2 text-blue-700 font-semibold rounded-lg text-sm">
                MANTENIMIENTO
              </Link>
              <Link href="/reparaciones" className="px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm">
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
            Mantenimiento Preventivo
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Extiende la vida útil de tus equipos y evita fallas costosas
          </p>
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Agenda tu servicio
            </Button>
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué hacer mantenimiento preventivo?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <Shield className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Previene fallas</h3>
              <p className="text-gray-600 text-sm">Antes de que ocurran y te causen problemas</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <Zap className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Mejor rendimiento</h3>
              <p className="text-gray-600 text-sm">Tu equipo trabaja más rápido y eficiente</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <DollarSign className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Ahorras dinero</h3>
              <p className="text-gray-600 text-sm">Evitas reparaciones costosas en el futuro</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 text-center">
              <Clock className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Más vida útil</h3>
              <p className="text-gray-600 text-sm">Tu equipo dura más tiempo funcionando</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Servicios por categoría */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Servicios por categoría
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Laptops */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Laptop className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">Laptops</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Limpieza interna
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Cambio de pasta térmica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Ventilación óptima
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Optimización de software
                  </li>
                </ul>
              </div>
            </Card>

            {/* PC / Computadoras */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cpu className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">PC / Computadoras</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Limpieza de componentes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Mantenimiento de fuente
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Actualización de hardware
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Ventilación y refrigeración
                  </li>
                </ul>
              </div>
            </Card>

            {/* Impresoras */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Printer className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">Impresoras</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Limpieza de cabezales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Calibración de colores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Desobstrucción
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Cambio de tintas/tóner
                  </li>
                </ul>
              </div>
            </Card>

            {/* PlayStation / Consolas */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Gamepad2 className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">PlayStation / Consolas</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Limpieza interna completa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Cambio de pasta térmica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Mantenimiento de lectores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Ventiladores y disipadores
                  </li>
                </ul>
              </div>
            </Card>

            {/* Otros equipos */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="w-10 h-10 text-blue-700" />
                  <h3 className="text-xl font-bold text-gray-800">Otros equipos</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Routers y redes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Monitores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Periféricos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Tablets y All-in-One
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ¿Qué incluye? */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Qué incluye nuestro servicio?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Diagnóstico inicial sin costo',
              'Limpieza profunda de hardware',
              'Cambio de pasta térmica (si aplica)',
              'Pruebas de rendimiento',
              'Reporte del estado del equipo',
              'Recomendaciones personalizadas'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <CheckCircle size={24} className="text-blue-700 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso en 4 pasos */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Solicitas el servicio', desc: 'Web, WhatsApp o presencial' },
              { num: '2', title: 'Diagnosticamos', desc: 'Sin compromiso y sin costo' },
              { num: '3', title: 'Realizamos', desc: 'Mantenimiento profesional' },
              { num: '4', title: 'Entregamos', desc: 'Con garantía y reporte' }
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

      {/* Garantía y confianza */}
      <section className="py-12 px-4 bg-blue-700 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield size={32} className="mb-2" />
              <span className="font-semibold">Técnicos certificados</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock size={32} className="mb-2" />
              <span className="font-semibold">Servicio rápido (24-48 hrs)</span>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign size={32} className="mb-2" />
              <span className="font-semibold">Garantía en el servicio</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle size={32} className="mb-2" />
              <span className="font-semibold">Repuestos de calidad</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            <details className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">¿Con qué frecuencia se recomienda hacer mantenimiento?</summary>
              <p className="text-gray-600 mt-2">Recomendamos hacer mantenimiento preventivo cada 6-12 meses, dependiendo del uso del equipo.</p>
            </details>
            <details className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">¿Cuánto tiempo dura el servicio?</summary>
              <p className="text-gray-600 mt-2">Varía según el equipo y complejidad, pero generalmente entre 2-4 horas laborables.</p>
            </details>
            <details className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">¿Recogen a domicilio?</summary>
              <p className="text-gray-600 mt-2">¡Sí! Ofrecemos servicio de recogida y entrega a domicilio en Machala y alrededores.</p>
            </details>
            <details className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-semibold text-gray-800">¿Tiene garantía el mantenimiento?</summary>
              <p className="text-gray-600 mt-2">Sí, ofrecemos garantía de 30 días en todos nuestros servicios de mantenimiento.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para agendar tu mantenimiento?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contacta con nosotros y te ayudamos a mantener tus equipos en óptimas condiciones
          </p>
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Solicita tu mantenimiento ahora
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}