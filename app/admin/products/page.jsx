'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, Button, Chip } from '@heroui/react'
import { Plus, Trash2, Edit, Package, Search } from 'lucide-react'

export default function ProductsList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      alert('✅ Producto eliminado')
      fetchProducts()
    } else {
      alert('❌ Error al eliminar')
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis Productos</h1>
            <p className="text-gray-600 mt-1">
              Tienes {products.length} productos registrados
            </p>
          </div>
          <Button
            color="primary"
            size="lg"
            onPress={() => router.push('/admin/products/new')}
            className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 shadow-lg rounded-xl"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Buscador */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        {/* Lista de Productos */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-700"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'Aún no hay productos'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Intenta con otro nombre' : 'Crea tu primer producto para empezar a vender'}
            </p>
            {!searchTerm && (
              <Button
                color="primary"
                onPress={() => router.push('/admin/products/new')}
                className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl"
              >
                <Plus size={20} className="mr-2" />
                Crear Producto
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Imagen */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Chip 
                      color={product.in_stock ? "success" : "danger"} 
                      variant="flat"
                      className="rounded-lg"
                    >
                      {product.in_stock ? 'En Stock' : 'Agotado'}
                    </Chip>
                  </div>
                </div>

                {/* Información */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Chip size="sm" variant="flat" color="primary" className="rounded-lg capitalize">
                      {product.category}
                    </Chip>
                    <span className="text-lg font-bold text-blue-900">
                      ${product.price}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-1" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">
                    {product.description || 'Sin descripción'}
                  </p>

                  {/* Botones de acción - Solo iconos */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="flex-1 rounded-lg h-10"
                      onPress={() => router.push(`/admin/products/edit/${product.id}`)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="rounded-lg h-10 px-3"
                      onPress={() => handleDelete(product.id)}
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