import type { Metadata } from 'next'

export const metadata:Metadata={title:'Carrito | UltraTecno',description:'Revisa tu selección de productos de UltraTecno.',robots:{index:false,follow:false,nocache:true},alternates:{canonical:'/cart'}}
export default function CartLayout({children}:{children:React.ReactNode}){return children}
