import { Providers } from '@/components/Providers'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
export const metadata={title:'UltraTecno | Tecnología, servicio técnico y cursos en Machala',description:'Productos, repuestos, mantenimiento, reparaciones y capacitaciones. Consulta directamente con UltraTecno por WhatsApp.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><Providers><a className="skip-link" href="#main">Saltar al contenido</a>{children}<WhatsAppButton/></Providers></body></html>}
