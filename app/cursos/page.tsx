import Navbar from '@/components/Navbar'
import { Courses } from '@/components/Catalog'
import { PageHeading, Footer, ContactBanner } from '@/components/Site'
import { seoMetadata } from '@/lib/seo'
import { getPublicCourses as readCourses, publicInitialData } from '@/lib/public-data'

export const revalidate=3600
const getPublicCourses=()=>publicInitialData(readCourses)
export const metadata=seoMetadata({title:'Cursos y capacitación tecnológica | UltraTecno',description:'Consulta cursos y capacitaciones tecnológicas disponibles en UltraTecno sobre electrónica, redes, soporte técnico y cuidado de equipos.',path:'/cursos'})
export default async function Page(){const courses=await getPublicCourses();return <><Navbar/><main id="main"><PageHeading eyebrow="APRENDE. PRACTICA. AVANZA." title="Cursos y capacitaciones." description="Electricidad, electrónica, redes y soporte técnico. Da el siguiente paso con nuevas habilidades."/><section className="wrap section"><Courses initialData={courses}/><p className="demo-note">Consulta fechas, cupos y condiciones por WhatsApp. Las inscripciones se gestionan individualmente.</p></section><ContactBanner/></main><Footer/></>}
