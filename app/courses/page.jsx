'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, Button, Chip } from '@heroui/react'
import { BookOpen, Clock, DollarSign, MessageCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })

    if (data) setCourses(data)
    setLoading(false)
  }

  // Número de WhatsApp
  const phoneNumber = '51999999999' // ← Cambia por tu número

  const getWhatsAppLink = (course) => {
    const message = `¡Hola! Me interesa inscribirme al curso: ${course.title} - Precio: $${course.price}`
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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                Inicio
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                Productos
              </Link>
              <Link href="/courses" className="text-blue-700 font-semibold">
                Cursos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros Cursos
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Aprende reparación de laptops, impresoras y electrónica con expertos. 
            Cursos prácticos con certificación.
          </p>
        </div>
      </div>

      {/* Cursos */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-700"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No hay cursos disponibles
            </h3>
            <p className="text-gray-500">
              Pronto estaremos publicando nuevos cursos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                {/* Imagen */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={course.image_url || 'https://via.placeholder.com/600x400?text=Curso'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Chip 
                      color="success"
                      variant="flat"
                      className="rounded-lg font-semibold"
                    >
                      Disponible
                    </Chip>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Detalles */}
                  <div className="space-y-2 mb-6">
                    {course.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} className="text-blue-600" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-blue-600" />
                      <span>Inicio inmediato</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                      <DollarSign size={18} />
                      <span className="text-2xl">{course.price}</span>
                      <span className="text-sm font-normal text-gray-600">USD</span>
                    </div>
                  </div>

                  {/* Botón de WhatsApp */}
                  <a
                    href={getWhatsAppLink(course)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      fullWidth
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg"
                      startContent={
                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                          <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      }
                    >
                      Inscribirme Ahora
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}