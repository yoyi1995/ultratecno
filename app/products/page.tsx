'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import { Card, Button, Chip } from '@heroui/react'
import { Search, ShoppingCart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string | number
  name: string
  category: string
  price: number
  description?: string | null
  image_url?: string | null
  in_stock?: boolean
  created_at?: string
}

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    // Obtener categoría de la URL si existe
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
    fetchProducts()
  }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    const { data } = await query

    if (data) {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

  // Filtrar productos
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Número de WhatsApp para el botón
  const phoneNumber = '+593995709352' // ← Cambia por tu número

  const getWhatsAppLink = (product: Product) => {
    const message = `¡Hola! Me interesa el producto: ${product.name} - Precio: $${product.price}`
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }

  const categories = [
    { key: '', label: 'Todos' },
    { key: 'repuestos', label: 'Repuestos' },
    { key: 'tintas', label: 'Tintas' },
    { key: 'flex', label: 'Flex' },
    { key: 'accesorios', label: 'Accesorios' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navbar simple */}
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
              <Link href="/products" className="text-blue-700 font-semibold">
                Productos
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
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
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-2">
            {selectedCategory ? `Categoría: ${selectedCategory}` : 'Todos los Productos'}
          </h1>
          <p className="text-blue-100 text-lg">
            Encuentra el repuesto exacto que necesitas
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Buscador */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>

          {/* Filtro de categorías */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.key}
                size="md"
                variant={selectedCategory === cat.key ? 'primary' : 'outline'}
                onPress={() => setSelectedCategory(cat.key)}
                className={`rounded-xl ${selectedCategory === cat.key ? 'bg-blue-700 text-white' : 'border-blue-700 text-blue-700 hover:bg-blue-50'}`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-700"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Chip 
                      color="success"
                      variant="soft"
                      className="rounded-lg"
                    >
                      En Stock
                    </Chip>
                  </div>
                </div>

                {/* Información */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Chip size="sm" variant="soft" color="default" className="rounded-lg capitalize">
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

                  {/* Botón de WhatsApp */}
                  <a
                    href={getWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      fullWidth
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Comprar por WhatsApp
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando productos...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}