import Navbar from '@/components/Navbar'
import { Courses } from '@/components/Catalog'
import { PageHeading, Footer, ContactBanner } from '@/components/Site'
export default function Page(){return <><Navbar/><main id="main"><PageHeading eyebrow="APRENDE. PRACTICA. AVANZA." title="Cursos y capacitaciones." description="Electricidad, electrónica, redes y soporte técnico. Da el siguiente paso con nuevas habilidades."/><section className="wrap section"><Courses/><p className="demo-note">Consulta fechas, cupos y condiciones por WhatsApp. Las inscripciones se gestionan individualmente.</p></section><ContactBanner/></main><Footer/></>}
