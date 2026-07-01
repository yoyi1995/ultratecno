'use client'

import { Card, Button } from '@heroui/react'
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  // Tu número de WhatsApp
  const phoneNumber = '51999999999' // ← Cambia por tu número
  const message = '¡Hola! Me pongo en contacto desde la página web'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                Inicio
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                Productos
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                Cursos
              </Link>
              <Link href="/contact" className="text-blue-700 font-semibold">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <Phone className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Escríbenos por WhatsApp y te respondemos de inmediato.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Información de Contacto */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Información de Contacto
            </h2>
            
            <div className="space-y-6">
              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">WhatsApp</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Respuesta rápida en horario de atención
                  </p>
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
                  >
                    +51 999 999 999
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Correo Electrónico</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Te respondemos en menos de 24 horas
                  </p>
                  <a href="mailto:info@ultratecno.com" className="text-blue-600 font-semibold hover:text-blue-700">
                    info@ultratecno.com
                  </a>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Ubicación</h3>
                  <p className="text-gray-600 text-sm">
                    Machala, Ecuador<br />
                    10 AGOSTO Y 8VA NORTE - FRENTE A LA FERRETERIA ARMIJOS
                  </p>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Horario de Atención</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>Lunes - Viernes: 8:30 am - 6:00 pm</p>
                    <p>Sábados: 8:30 am - 6:00 pm</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Botón de WhatsApp Grande */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ¿Necesitas ayuda?
            </h2>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Escríbenos por WhatsApp
              </h3>
              
              <p className="text-gray-600 mb-8">
                Te atendemos de inmediato. Consulta por productos, cursos o lo que necesites.
              </p>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  size="lg"
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg py-6 text-lg"
                  startContent={
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  }
                >
                  Chatear por WhatsApp
                </Button>
              </a>

              <p className="text-sm text-gray-500 mt-4">
                También puedes hacer clic en el botón flotante de WhatsApp
              </p>
            </div>
          </Card>
        </div>

        {/* Mapa (Opcional - Puedes agregar tu ubicación de Google Maps) */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-96 bg-gray-200 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                ¿Dónde estamos?
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega aquí tu mapa de Google Maps
              </p>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
  <div className="h-96">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.36380571192!2d-79.9501599252489!3d-3.259503340966182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x90330fdb5f7ffb8f%3A0x79a2ef2a7bb0bb78!2sULTRATECNO%20Servicio%20t%C3%A9cnico%20de%20computadoras%20en%20Machala!5e0!3m2!1ses!2sec!4v1782932421661!5m2!1ses!2sec"
      width="100%" 
      height="100%" 
      style={{border:0}} 
      allowFullScreen="" 
      loading="lazy" 
      referrerPolicy="strict-origin-when-cross-origin"
      title="Ubicación UltraTecno - Machala"
    ></iframe>
  </div>
</Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}