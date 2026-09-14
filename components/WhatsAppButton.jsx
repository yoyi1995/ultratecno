'use client'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/whatsapp'
export default function WhatsAppButton(){const path=usePathname();if(path.startsWith('/admin'))return null;return <a className="whatsapp-float" href={whatsappUrl('Hola UltraTecno, me gustaría recibir información.')} target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp"><MessageCircle size={26}/></a>}
