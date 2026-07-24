'use client'

import { Card, Button } from '@heroui/react'
import { Printer, Laptop, Cpu, Monitor, Wrench, DollarSign, Shield, Clock, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

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

  // Estado para controlar modal
  const [selectedService, setSelectedService] = useState<string | null>(null)

  // Datos de servicios con características ampliadas
  const services = [
    {
      id: 'impresoras',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7wI0acGiR6kUTuW1CKo9eEWsjEqWg8thjiSSHjKM4Tw&s=10',
      title: 'Impresoras',
      icon: Printer,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      features: [
        'Cambio de cartuchos/tóner',
        'Reparación de cabezales',
        'Solución de errores',
        'Configuración de red'
      ],
      detailedInfo: {
        description: 'Servicio especializado en todas las marcas y modelos de impresoras láser, de inyección y multifuncionales.',
        process: [
          'Diagnóstico completo del problema',
          'Identificación de piezas dañadas',
          'Reemplazo o reparación necesaria',
          'Pruebas de calidad',
          'Entrega con garantía'
        ],
        additionalServices: [
          'Reseteo de impresoras',
          'Cambio de caja de mantenimiento',
          'Limpieza profunda de cabezales',
          'Calibración de colores',
          'Configuración de impresión a doble cara'
        ],
        guarantee: 'Garantía de 90 días en piezas y mano de obra'
      }
    },
    {
      id: 'laptops',
      image: 'https://img.magnific.com/foto-gratis/placa-circuito-compensacion-tecnica-computadora-portatil-desmontada_1098-13785.jpg?semt=ais_hybrid&w=740&q=80',
      title: 'Laptops',
      icon: Laptop,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      features: [
        'Cambio de pantallas',
        'Reparación de teclados',
        'Solución de sobrecalentamiento',
        'Recuperación de datos'
      ],
      detailedInfo: {
        description: 'Reparación integral de laptops de todas las marcas: Dell, HP, Lenovo, Acer, Asus, Apple y más.',
        process: [
          'Diagnóstico del problema',
          'Evaluación de componentes',
          'Presupuesto sin compromiso',
          'Reparación especializada',
          'Pruebas funcionales'
        ],
        additionalServices: [
          'Cambio de batería',
          'Reparación de puertos USB/HDMI',
          'Reemplazo de discos duros SSD/HDD',
          'Instalación y reinstalación de sistemas',
          'Actualización de memoria RAM'
        ],
        guarantee: 'Garantía de 90 días en piezas y 30 días en mano de obra'
      }
    },
    {
      id: 'pcs',
      image: 'https://media.gettyimages.com/id/1496911536/es/foto/primer-plano-de-la-torre-de-la-computadora-y-las-manos-de-un-hombre-que-intenta-encontrar-el.jpg?s=612x612&w=gi&k=20&c=5TgrzhXYFN7E5sKIWUxybt98pWrtI9JyZXOh5mkDcps=',
      title: 'PCs / Escritorio',
      icon: Cpu,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      features: [
        'Diagnóstico completo',
        'Reparación de motherboards',
        'Cambio de fuentes',
        'Actualización de componentes'
      ],
      detailedInfo: {
        description: 'Servicios de reparación y armado de computadoras de escritorio, PCs gaming, workstations y servidores.',
        process: [
          'Revisión de componentes',
          'Pruebas de hardware',
          'Identificación de fallas',
          'Reparación o reemplazo',
          'Ensamblaje profesional'
        ],
        additionalServices: [
          'Armado de equipos nuevos',
          'Mejoras de rendimiento',
          'Overclock seguro',
          'Refrigeración líquida',
          'Cableado organizado'
        ],
        guarantee: 'Garantía de 90 días en piezas y 30 días en mano de obra'
      }
    },
    {
      id: 'tvs',
      image: 'https://media.istockphoto.com/id/1389783400/es/foto/el-hombre-reparando-la-televisi%C3%B3n-rota-en-casa.jpg?s=612x612&w=0&k=20&c=I2XoeFcBHBNjNDvFI0w53YA60fV91MBPNVpy7aFVvpQ=',
      title: 'TVs / Monitores',
      icon: Monitor,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      features: [
        'Reparación de pantallas',
        'Solución de imagen',
        'Reparación de audio',
        'Conexiones HDMI/USB'
      ],
      detailedInfo: {
        description: 'Reparación de televisores LED, LCD, OLED y monitores de todas las marcas y tamaños.',
        process: [
          'Diagnóstico de la falla',
          'Revisión de la placa principal',
          'Reparación de componentes',
          'Ajustes de imagen y sonido',
          'Control de calidad final'
        ],
        additionalServices: [
          'Reparación de placas madres',
          'Ajuste de colores y contraste',
          'Reparación de altavoces',
          'Configuración de puertos HDMI',
          'Actualización de firmware'
        ],
        guarantee: 'Garantía de 60 días en reparaciones'
      }
    },
    {
      id: 'otros',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3jpUHnvhHUoqDfjpCzzBjrlSS64tiks8A4YmetMQkwsobXwLGqnBwE--N&s=10',
      title: 'Otros equipos',
      icon: Wrench,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      features: [
        'Consolas de videojuegos',
        'Audio y equipos',
        'Fuentes de poder',
        'Periféricos'
      ],
      detailedInfo: {
        description: 'Servicio técnico especializado en equipos electrónicos diversos e industriales.',
        process: [
          'Evaluación técnica especializada',
          'Diagnóstico preciso',
          'Presupuesto detallado',
          'Reparación profesional',
          'Garantía de servicio'
        ],
        additionalServices: [
          'Reparación de consolas (PlayStation, Xbox, Nintendo)',
          'Equipos de audio y amplificadores',
          'Fuentes de poder y UPS',
          'Periféricos y dispositivos USB',
          'Equipos industriales'
        ],
        guarantee: 'Garantía de 30-60 días según el equipo'
      }
    }
  ]

  // Encontrar servicio seleccionado
  const selectedServiceData = services.find(s => s.id === selectedService)

  // Efecto: cerrar con Escape y bloquear scroll cuando el modal está abierto
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    if (selectedService) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [selectedService])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />

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
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card 
                  key={service.id} 
                  className={`relative bg-cover bg-center backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer`}
                  style={{ backgroundImage: `url(${service.image})` }}
                  onClick={() => setSelectedService(service.id)}
                >
                  {/* overlay for readability */}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="p-6 relative z-10 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-10 h-10 ${service.iconColor}`} />
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>
                    <ul className="space-y-2 text-white/90 text-sm mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-200" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                        onPress={() => setSelectedService(service.id)}
                      >
                        Ver detalles
                      </Button>
                      <a href={getWhatsAppUrl(service.title)} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold" onPress={(e:any) => e?.stopPropagation()}>
                          Consultar por WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modal flotante personalizado */}
      {selectedServiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedService(null)} />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 m-4 z-10 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              {selectedServiceData.icon && (
                <selectedServiceData.icon className={`w-8 h-8 ${selectedServiceData.iconColor}`} />
              )}
              <h2 className="text-2xl font-bold text-gray-800">Servicio de {selectedServiceData.title}</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Descripción del servicio</h3>
                <p className="text-gray-600">{selectedServiceData.detailedInfo.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Nuestro proceso</h3>
                <ol className="space-y-2">
                  {selectedServiceData.detailedInfo.process.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Servicios relacionados</h3>
                <ul className="space-y-2">
                  {selectedServiceData.detailedInfo.additionalServices.map((additional, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-gray-600">{additional}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-700" />
                  <span className="font-semibold text-gray-800">Garantía</span>
                </div>
                <p className="text-gray-600 mt-1">{selectedServiceData.detailedInfo.guarantee}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onPress={() => setSelectedService(null)} className="rounded-xl">Cerrar</Button>
              <a href={getWhatsAppUrl(selectedServiceData.title)} target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold" onPress={() => setSelectedService(null)}>Consultar por WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      )}

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