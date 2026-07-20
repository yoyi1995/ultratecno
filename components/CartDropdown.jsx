'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

// Componente que muestra el icono del carrito con el contador de items
// y un dropdown con los productos agregados
export default function CartDropdown() {
  // Estado para controlar si el dropdown está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false)
  
  // Obtenemos los datos del carrito del contexto
  const { items, total, itemCount, removeItem } = useCart()

  // Si el carrito está vacío, solo mostramos el icono
  if (itemCount === 0) {
    return (
      <Link 
        href="/cart" 
        className="relative p-2 text-gray-700 hover:text-blue-700 transition-colors"
      >
        <ShoppingCart size={24} />
      </Link>
    )
  }

  return (
    <div className="relative">
      {/* Botón del carrito con contador */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-700 transition-colors"
      >
        <ShoppingCart size={24} />
        {/* Badge con el número total de items */}
        <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      </button>

      {/* Dropdown con los productos del carrito */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4">
          {/* Header del dropdown */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Carrito de Compras</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Lista de productos (máximo 3 visibles) */}
          <div className="max-h-64 overflow-y-auto mb-4">
            {items.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                {/* Imagen del producto */}
                <img
                  src={item.image_url || 'https://via.placeholder.com/50'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                
                {/* Información del producto */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × ${item.price}
                  </p>
                </div>

                {/* Precio total del item */}
                <span className="text-sm font-bold text-blue-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            
            {/* Mensaje si hay más productos */}
            {items.length > 3 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                +{items.length - 3} productos más
              </p>
            )}
          </div>

          {/* Total y botones */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-blue-700 text-lg">
                ${total.toFixed(2)}
              </span>
            </div>
            
            {/* Botón para ir al carrito completo */}
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition-colors mb-2"
            >
              Ver Carrito Completo
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}