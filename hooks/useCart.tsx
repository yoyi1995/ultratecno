'use client'
import { createContext, useContext, useState, useEffect } from 'react'
export interface CartItem {id:string|number;name:string;price:number;quantity:number;image_url?:string|null;category?:string}
interface CartContextType {items:CartItem[];addItem:(p:Omit<CartItem,'quantity'>)=>void;removeItem:(id:string|number)=>void;updateQuantity:(id:string|number,q:number)=>void;clearCart:()=>void;total:number;itemCount:number}
const CartContext=createContext<CartContextType|undefined>(undefined)
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error('useCart debe usarse dentro de CartProvider');return c}
function validItem(value:unknown):value is CartItem{if(!value||typeof value!=='object')return false;const v=value as Partial<CartItem>;return (typeof v.id==='string'||typeof v.id==='number')&&typeof v.name==='string'&&typeof v.price==='number'&&Number.isFinite(v.price)&&v.price>=0&&typeof v.quantity==='number'&&Number.isInteger(v.quantity)&&v.quantity>0&&v.quantity<=99}
export function CartProvider({children}:{children:React.ReactNode}){
 const [items,setItems]=useState<CartItem[]>([]);const [ready,setReady]=useState(false)
 useEffect(()=>{const timer=window.setTimeout(()=>{try{const saved=JSON.parse(localStorage.getItem('cart')||'[]');if(Array.isArray(saved)){const seen=new Set<string>();setItems(saved.filter(validItem).filter(i=>{const key=String(i.id);if(seen.has(key))return false;seen.add(key);return true}))}}catch{localStorage.removeItem('cart')}finally{setReady(true)}},0);return()=>window.clearTimeout(timer)},[])
 useEffect(()=>{if(ready){try{localStorage.setItem('cart',JSON.stringify(items))}catch{/* Cart stays usable when browser storage is unavailable. */}}},[items,ready])
 const removeItem=(id:string|number)=>setItems(old=>old.filter(i=>String(i.id)!==String(id)))
 const addItem=(p:Omit<CartItem,'quantity'>)=>{if(!Number.isFinite(p.price)||p.price<0)return;setItems(old=>old.some(i=>String(i.id)===String(p.id))?old.map(i=>String(i.id)===String(p.id)?{...i,quantity:Math.min(99,i.quantity+1)}:i):[...old,{...p,quantity:1}])}
 const updateQuantity=(id:string|number,q:number)=>{if(!Number.isFinite(q))return;if(q<=0){removeItem(id);return}setItems(old=>old.map(i=>String(i.id)===String(id)?{...i,quantity:Math.min(99,Math.max(1,Math.floor(q)))}:i))}
 const total=items.reduce((sum,i)=>sum+Math.round(i.price*100)*i.quantity,0)/100
 return <CartContext.Provider value={{items,addItem,removeItem,updateQuantity,clearCart:()=>setItems([]),total,itemCount:items.reduce((sum,i)=>sum+i.quantity,0)}}>{children}</CartContext.Provider>
}
