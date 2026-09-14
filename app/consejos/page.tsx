import Navbar from '@/components/Navbar'
import { Tips } from '@/components/Catalog'
import { PageHeading, Footer, ContactBanner } from '@/components/Site'
export default function Page(){return <><Navbar/><main id="main"><PageHeading eyebrow="APRENDE ALGO ÚTIL HOY" title="Consejos y tips para tu equipo." description="Ideas prácticas, cuidados cotidianos y mini videos para conocer mejor tu tecnología."/><section className="wrap section"><Tips/></section><ContactBanner/></main><Footer/></>}
