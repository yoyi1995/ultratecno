import Navbar from '@/components/Navbar'
import { Services } from '@/components/Catalog'
import { PageHeading, SectionHeading, Footer, ContactBanner } from '@/components/Site'
import { seoMetadata } from '@/lib/seo'
import { getPublicServices as readServices, publicInitialData } from '@/lib/public-data'
export const revalidate=3600
const getPublicServices=()=>publicInitialData(readServices)
export const metadata=seoMetadata({title:'Mantenimiento preventivo de equipos | UltraTecno',description:'Mantenimiento preventivo de laptops, computadoras, impresoras, consolas y redes en Machala para ayudar a prevenir problemas y cuidar tus equipos.',path:'/mantenimiento'})
export default async function Page(){const services=await getPublicServices();return <><Navbar/><main id="main"><PageHeading eyebrow="CUIDA LO QUE TE MUEVE" title="Mantenimiento preventivo." description="Revisión, limpieza y recomendaciones para acompañar la vida útil de tus equipos."/><section className="wrap section"><SectionHeading eyebrow="PREVENCIÓN POR TIPO DE EQUIPO" title="Mantenimiento preventivo para tus equipos" description="Cuida tus equipos con limpieza, revisión y mantenimiento técnico para ayudar a prevenir sobrecalentamiento, acumulación de polvo y fallas prematuras."/><Services kind="mantenimiento" initialData={services}/><div className="process-strip">{['Revisión inicial','Limpieza y mantenimiento','Pruebas de funcionamiento','Recomendaciones de cuidado'].map((s,i)=><div key={s}><span>0{i+1}</span><h3>{s}</h3></div>)}</div><p className="muted">El mantenimiento ayuda a prevenir problemas. El alcance, costo y tiempo se confirman después de evaluar el equipo.</p></section><ContactBanner/></main><Footer/></>}
