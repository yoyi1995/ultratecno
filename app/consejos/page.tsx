import Navbar from '@/components/Navbar'
import { Tips } from '@/components/Catalog'
import { PageHeading, Footer, ContactBanner } from '@/components/Site'
import { seoMetadata } from '@/lib/seo'
import { getPublicTips as readTips, publicInitialData } from '@/lib/public-data'
export const revalidate=3600
const getPublicTips=()=>publicInitialData(readTips)
export const metadata=seoMetadata({title:'Consejos para cuidar tus equipos | UltraTecno',description:'Consejos prácticos sobre mantenimiento, seguridad y uso de laptops, computadoras, impresoras y otros equipos tecnológicos.',path:'/consejos'})
export default async function Page(){const tips=await getPublicTips();return <><Navbar/><main id="main"><PageHeading eyebrow="APRENDE ALGO ÚTIL HOY" title="Consejos y tips para tu equipo." description="Ideas prácticas, cuidados cotidianos y mini videos para conocer mejor tu tecnología."/><section className="wrap section"><Tips initialData={tips}/></section><ContactBanner/></main><Footer/></>}
