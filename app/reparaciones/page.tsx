import Navbar from '@/components/Navbar'
import { Services } from '@/components/Catalog'
import { PageHeading, SectionHeading, Footer, ContactBanner } from '@/components/Site'
import { seoMetadata } from '@/lib/seo'
import { getPublicServices as readServices, publicInitialData } from '@/lib/public-data'
export const revalidate=3600
const getPublicServices=()=>publicInitialData(readServices)
export const metadata=seoMetadata({title:'Reparación y diagnóstico de equipos | UltraTecno',description:'Diagnóstico y reparación de laptops, computadoras, impresoras, consolas y redes en Machala. Consulta la falla de tu equipo con UltraTecno.',path:'/reparaciones'})
export default async function Page(){const services=await getPublicServices();return <><Navbar/><main id="main"><PageHeading eyebrow="SERVICIO TÉCNICO" title="¿Tu equipo presenta una falla?" description="Conoce algunos de los problemas que atendemos y solicita un diagnóstico técnico."/><section className="wrap section"><SectionHeading eyebrow="DIAGNÓSTICO POR TIPO DE EQUIPO" title="Fallas comunes que atendemos" description="Identifica los síntomas que presenta tu equipo. El origen exacto se confirma únicamente después de un diagnóstico técnico."/><Services kind="reparacion" initialData={services}/><div className="process-strip">{['Cuéntanos el problema','Evaluamos tu equipo','Confirmas el presupuesto','Coordinamos la entrega'].map((s,i)=><div key={s}><span>0{i+1}</span><h3>{s}</h3></div>)}</div></section><ContactBanner/></main><Footer/></>}
