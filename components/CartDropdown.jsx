'use client'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
export default function CartDropdown(){const {itemCount}=useCart();return <Link href="/cart" className="cart-link" aria-label={'Carrito, '+itemCount+' productos'}><ShoppingBag size={23}/><span className="cart-label">Carrito</span><span className="cart-count">{itemCount}</span></Link>}
