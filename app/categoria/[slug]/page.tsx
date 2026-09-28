import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { CatalogImage, ProductCard } from '@/components/Catalog'
import { ContactBanner, Footer, PageHeading } from '@/components/Site'
import { getPublicCategories, getPublicProducts } from '@/lib/public-data'
import { seoMetadata } from '@/lib/seo'

type Props={params:Promise<{slug:string}>}
async function categoryFor(slug:string){return (await getPublicCategories()).find(category=>category.slug===slug)}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const category=await categoryFor(slug);if(!category)return {title:'Categoría no encontrada',robots:{index:false,follow:false}};return seoMetadata({title:`${category.name}: productos y accesorios | UltraTecno`,description:`Explora los productos activos de ${category.name} disponibles en UltraTecno y consulta precio, disponibilidad y atención por WhatsApp.`,path:`/categoria/${category.slug}`,image:category.image_url})}
export default async function CategoryPage({params}:Props){const {slug}=await params;const [category,products]=await Promise.all([categoryFor(slug),getPublicProducts()]);if(!category)notFound();const matches=products.filter(product=>product.category===category.slug);return <><Navbar/><main id="main"><PageHeading eyebrow="CATEGORÍA DE TIENDA" title={category.name} description={`Consulta los productos activos de ${category.name} disponibles en UltraTecno.`}/><section className="wrap section"><div className="category-intro"><CatalogImage src={category.image_url} alt={`Categoría ${category.name} de UltraTecno`}/><div><h2>{category.name} en UltraTecno</h2><p>Revisa el catálogo disponible y consulta por WhatsApp antes de comprar. La disponibilidad corresponde a lo publicado actualmente.</p></div></div>{matches.length?<div className="product-grid catalog-products">{matches.map(product=><ProductCard key={product.id} product={product}/>)}</div>:<div className="empty-state"><h2>Sin productos publicados por ahora</h2><p>Esta categoría está disponible, pero actualmente no tiene productos activos en el catálogo.</p></div>}</section><ContactBanner/></main><Footer/></>}
