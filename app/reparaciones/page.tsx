import Navbar from '@/components/Navbar'
import { Services } from '@/components/Catalog'
import { PageHeading, Footer, ContactBanner } from '@/components/Site'
export default function Page(){return <><Navbar/><main id="main"><PageHeading eyebrow="SERVICIO TÉCNICO" title="Volvamos a ponerlo en marcha." description="Laptops, computadoras, impresoras, electrónica y más. Encuentra el servicio que necesita tu equipo."/><section className="wrap section"><Services/><div className="process-strip">{['Cuéntanos el problema','Evaluamos tu equipo','Confirmas el presupuesto','Coordinamos la entrega'].map((s,i)=><div key={s}><span>0{i+1}</span><h3>{s}</h3></div>)}</div></section><ContactBanner/></main><Footer/></>}
