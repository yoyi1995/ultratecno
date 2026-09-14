'use client'
import { useState } from 'react'
import { Button } from '@heroui/react'
import { Search, Menu, X, ChevronDown, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CartDropdown from './CartDropdown'
import { useContent } from '@/hooks/useContent'
import { whatsappUrl } from '@/lib/whatsapp'
const links=[['/products','Tienda'],['/mantenimiento','Mantenimiento Preventivo'],['/reparaciones','Reparaciones'],['/courses','Cursos'],['/quienes-somos','Quiénes Somos'],['/contact','Contacto']]
export default function Navbar(){
 const pathname=usePathname(); const [open,setOpen]=useState(false); const {data:categories}=useContent('categories')
 if(pathname.startsWith('/admin'))return null
 return <header className="site-header"><div className="topbar"><div className="wrap flex justify-between gap-3"><span>TECNOLOGÍA · SERVICIO TÉCNICO · CAPACITACIÓN</span><span>Machala, Ecuador</span></div></div><div className="wrap header-main"><Link href="/" aria-label="UltraTecno, inicio"><img className="brand-logo" src="/images/logo-ultratecno.png" alt="UltraTecno — Más allá de la Tecnología" width="240" height="70" /></Link><form action="/products" className="search-box" role="search"><input name="q" aria-label="Buscar productos" placeholder="¿Qué necesita tu equipo?"/><Button type="submit" isIconOnly aria-label="Buscar"><Search size={20}/></Button></form><a className="header-help" href={whatsappUrl('Hola UltraTecno, necesito asesoría.')} target="_blank" rel="noreferrer"><MessageCircle size={24}/><span>Hablemos por WhatsApp<strong>098 780 8181</strong></span></a><CartDropdown/><Button className="mobile-toggle" isIconOnly aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="public-nav" onPress={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div><nav id="public-nav" aria-label="Navegación principal" className={'wrap main-nav '+(open?'is-open':'')}><details className="category-menu"><summary><Menu size={17}/> Categorías <ChevronDown size={15}/></summary><div className="category-popover">{categories.map(c=><Link onClick={()=>setOpen(false)} href={'/products?category='+encodeURIComponent(c.slug)} key={c.id}>{c.name}</Link>)}<Link href="/consejos">Consejos y tips</Link></div></details>{links.map(([href,label])=><Link key={href} href={href} aria-current={pathname===href?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}</nav></header>
}
