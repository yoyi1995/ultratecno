import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Site'
import Link from 'next/link'

export default function NotFound(){return <><Navbar/><main id="main" className="wrap section"><div className="empty-state"><p className="eyebrow">ERROR 404</p><h1>Página no encontrada</h1><p>La dirección solicitada no existe o el contenido ya no está disponible.</p><Link className="action" href="/">Volver a UltraTecno</Link></div></main><Footer/></>}
