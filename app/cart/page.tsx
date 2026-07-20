'use client'

import { Button, Card } from '@heroui/react'
import { ShoppingCart, MessageCircle, Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

// Página del carrito de compras
// Muestra todos los productos agregados y permite realizar la compra por WhatsApp
export default function CartPage() {
  // Obtenemos los datos del carrito del contexto
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart()

  // Número de WhatsApp para realizar la compra (debe cambiar por el número real)
  const phoneNumber = '593995709352'

  // Generar el mensaje de WhatsApp con los productos y el total
  const getWhatsAppMessage = () => {
    // Construimos la lista de productos con su cantidad y precio
    const productList = items.map(item => 
      `${item.quantity} × ${item.name} - $${item.price * item.quantity}`
    ).join('\n')
    
    // Mensaje completo para WhatsApp
    return `¡Hola! Quiero comprar los siguientes productos:\n\n${productList}\n\nTotal: $${total.toFixed(2)}`
  }

  // URL de WhatsApp con el mensaje prellenado
  const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(getWhatsAppMessage())}`

  // Renderizar estado vacío del carrito
  if (items.length === 0) {
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
                <Link href="/products" className="text-blue-700 font-semibold">
                  Productos
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-blue-700 transition-colors font-medium">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenido vacío */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">Agrega productos desde la tienda</p>
          <Link href="/products">
            <Button className="bg-blue-700 text-white rounded-xl font-semibold px-6">
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
              <Link href="/products" className="text-blue-700 font-semibold">
                Productos
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
          <h1 className="text-4xl font-bold mb-2">Carrito de Compras</h1>
          <p className="text-blue-100">Revisa tus productos antes de comprar</p>
        </div>
      </div>

      {/* Contenido del carrito */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Productos ({itemCount} items)</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={clearCart}
                    className="text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    Vaciar Carrito
                  </Button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* Imagen del producto */}
                      <img
                        src={item.image_url || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-lg font-bold text-blue-700 mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Control de cantidad */}
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-lg"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-lg"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>

                      {/* Subtotal y botón eliminar */}
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-lg mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => removeItem(item.id)}
                          className="text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Resumen del carrito */}
          <div>
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de Compra</h2>
              
              {/* Detalle de precios */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-blue-700">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de WhatsApp */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  fullWidth
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2 py-6"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Comprar por WhatsApp
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}