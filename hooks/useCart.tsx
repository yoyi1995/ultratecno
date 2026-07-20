'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Interfaz para los items del carrito
interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image_url?: string | null
  category?: string
}

// Interfaz para el contexto del carrito
interface CartContextType {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

// Creamos el contexto del carrito
const CartContext = createContext<CartContextType | undefined>(undefined)

// Hook personalizado para usar el carrito en cualquier componente
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider')
  }
  return context
}

// Proveedor del carrito - envuelve la aplicación para manejar el estado global
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Estado para los items del carrito, inicializado desde localStorage
  const [items, setItems] = useState<CartItem[]>([])

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Agregar un producto al carrito
  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Verificar si el producto ya existe en el carrito
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Si existe, incrementar la cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      // Si no existe, agregarlo con cantidad 1
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  // Eliminar un producto del carrito
  const removeItem = (id: string | number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  // Actualizar la cantidad de un producto
  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // Limpiar el carrito completamente
  const clearCart = () => {
    setItems([])
  }

  // Calcular el total de la compra (suma de precio * cantidad)
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Contar el total de items (suma de cantidades)
  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  // Valor del contexto que se comparte
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}