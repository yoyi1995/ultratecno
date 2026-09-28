import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import StructuredData from '@/components/StructuredData'
import WhatsAppButton from '@/components/WhatsAppButton'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import './globals.css'

export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:{default:'UltraTecno | Tienda tecnológica, mantenimiento y reparación',template:`%s | ${SITE_NAME}`},description:'Productos y accesorios tecnológicos, tintas, cables, adaptadores y repuestos. Mantenimiento y reparación de laptops, PC e impresoras en Machala.',applicationName:SITE_NAME,icons:{icon:'/favicon.ico'}}
const organization={"@context":"https://schema.org","@type":"LocalBusiness","@id":`${SITE_URL}/#business`,name:SITE_NAME,url:SITE_URL,logo:`${SITE_URL}/images/logo-ultratecno.png`,image:`${SITE_URL}/images/local-ultratecno.jpeg`,telephone:'+593987808181',description:'Tienda tecnológica y servicio técnico de mantenimiento y reparación en Machala.',address:{"@type":"PostalAddress",streetAddress:'10 de Agosto y 8va Norte, frente a la Ferretería Armijos',addressLocality:'Machala',addressCountry:'EC'}}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><StructuredData data={organization}/><Providers><a className="skip-link" href="#main">Saltar al contenido</a>{children}<WhatsAppButton/></Providers></body></html>}
