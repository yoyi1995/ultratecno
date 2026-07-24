'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  Button, 
  Input, 
  TextArea,
  Switch
} from '@heroui/react'
import { 
  Package, 
  Upload, 
  Save, 
  ArrowLeft,
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText
} from 'lucide-react'

export default function NewProduct() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    in_stock: true,
  })
  const router = useRouter()

  const categories = [
    { key: 'repuestos', label: 'Repuestos' },
    { key: 'tintas', label: 'Tintas' },
    { key: 'flex', label: 'Flex' },
    { key: 'accesorios', label: 'Accesorios' },
  ]

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data.url) {
        setImageUrl(data.url)
      }
    } catch (error) {
      console.error('Error al subir imagen:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            slug: slug,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: imageUrl,
            in_stock: formData.in_stock,
          }
        ])

      if (error) throw error

      alert('✅ Producto creado exitosamente')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error al crear producto:', error)
      alert('❌ Error al crear el producto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="flat"
            onPress={() => router.back()}
            className="mb-4 bg-white hover:bg-gray-100 transition-colors rounded-xl"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Crear Nuevo Producto
          </h1>
          <p className="text-gray-600 mt-2">
            Completa la información del producto
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Información */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Información Básica
                      </h2>
                      <p className="text-sm text-gray-500">
                        Nombre y detalles del producto
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-2 text-blue-700" />
                      Nombre del Producto
                    </label>
                    <Input
                      type="text"
                      placeholder="Ej: Tinta HP 63 Negro"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      variant="bordered"
                      required
                      className="w-full"
                      classNames={{
                        input: "text-base",
                        inputWrapper: "h-12 border-gray-300 hover:border-blue-500 focus:border-blue-700 transition-colors rounded-xl"
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-white hover:border-blue-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all text-base"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-2 text-blue-700" />
                      Precio
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      variant="bordered"
                      required
                      className="w-full"
                      classNames={{
                        input: "text-base",
                        inputWrapper: "h-12 border-gray-300 hover:border-blue-500 focus:border-blue-700 transition-colors rounded-xl"
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2 text-blue-700" />
                      Descripción
                    </label>
                    <TextArea
                      placeholder="Describe el producto..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      variant="bordered"
                      rows={4}
                      required
                      className="w-full"
                      classNames={{
                        input: "text-base",
                        inputWrapper: "border-gray-300 hover:border-blue-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all rounded-xl"
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Columna derecha - Imagen y opciones */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Imagen
                      </h2>
                      <p className="text-sm text-gray-500">
                        Foto del producto
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {imageUrl ? (
                      <div className="relative group">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                        />
                        <Button
                          color="danger"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          onPress={() => setImageUrl('')}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                        <ImageIcon className="w-16 h-16 text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">
                          Sin imagen
                        </p>
                      </div>
                    )}

                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <div className={`
                        w-full h-12 rounded-xl font-semibold text-base
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        ${uploading 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }
                      `}>
                        <Upload size={20} />
                        {uploading ? 'Subiendo...' : 'Subir Imagen'}
                      </div>
                    </label>

                    <p className="text-xs text-gray-500 text-center">
                      Formatos: JPG, PNG, WebP. Máx: 5MB
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Disponible en Stock
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        El producto se mostrará en la tienda
                      </p>
                    </div>
                    <Switch
                      isSelected={formData.in_stock}
                      onValueChange={(value) => setFormData({...formData, in_stock: value})}
                      color="success"
                      size="lg"
                    />
                  </div>
                </div>
              </Card>

  <div className="flex flex-col gap-3">
  <Button
    type="submit"
    size="md"
    fullWidth
    isLoading={loading}
    className="h-11 text-base font-semibold text-white bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 shadow-lg rounded-xl"
  >
    {loading ? 'Guardando...' : 'Guardar Producto'}
  </Button>
  <Button
    type="button"
    size="md"
    fullWidth
    onPress={() => router.back()}
    className="h-11 text-base font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 shadow-md rounded-xl"
  >
    Cancelar
  </Button>
</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}