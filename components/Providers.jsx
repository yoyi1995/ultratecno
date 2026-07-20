'use client'

import { CartProvider } from '@/hooks/useCart'

// Proveedor principal que envuelve toda la aplicación
// Incluye el CarProvider para manejar el estado global del carrito
export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
