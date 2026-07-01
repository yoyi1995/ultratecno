'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, Button, Chip } from '@heroui/react'
import { Plus, Trash2, Edit, BookOpen, Search, Clock, DollarSign } from 'lucide-react'

export default function CoursesList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setCourses(data)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return
    
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (!error) {
      alert('✅ Curso eliminado')
      fetchCourses()
    } else {
      alert('❌ Error al eliminar')
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis Cursos</h1>
            <p className="text-gray-600 mt-1">
              Tienes {courses.length} cursos registrados
            </p>
          </div>
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push('/admin/courses/new')}
            className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 shadow-lg rounded-xl"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Curso
          </Button>
        </div>

        {/* Buscador */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar cursos por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        {/* Lista de Cursos */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-700"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'Aún no hay cursos'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Intenta con otro título' : 'Crea tu primer curso para empezar a enseñar'}
            </p>
            {!searchTerm && (
              <Button
                color="primary"
                onPress={() => router.push('/admin/courses/new')}
                className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl"
              >
                <Plus size={20} className="mr-2" />
                Crear Curso
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Imagen */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={course.image_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Chip 
                      color={course.available ? "success" : "danger"} 
                      variant="flat"
                      className="rounded-lg"
                    >
                      {course.available ? 'Disponible' : 'No disponible'}
                    </Chip>
                  </div>
                </div>

                {/* Información */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-bold text-blue-900 flex items-center gap-1">
                      <DollarSign size={16} />
                      {course.price}
                    </span>
                    {course.duration && (
                      <span className="text-xs text-gray-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                        <Clock size={12} />
                        {course.duration}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-1" title={course.title}>
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">
                    {course.description || 'Sin descripción'}
                  </p>

                  {/* Botones de acción - Solo iconos */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="flex-1 rounded-lg h-10"
                      onPress={() => router.push(`/admin/courses/edit/${course.id}`)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="rounded-lg h-10 px-3"
                      onPress={() => handleDelete(course.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}