import Navbar from '@/components/Navbar'
import ProductsCatalog from '@/components/ProductsCatalog'
import { Footer } from '@/components/Site'
import { seoMetadata } from '@/lib/seo'
import { getPublicCategories as readCategories, getPublicProducts as readProducts, publicInitialData } from '@/lib/public-data'

export const revalidate=3600
const getPublicProducts=()=>publicInitialData(readProducts)
const getPublicCategories=()=>publicInitialData(readCategories)
export const metadata=seoMetadata({title:'Tienda de tecnología y accesorios | UltraTecno',description:'Explora productos disponibles y categorías de tintas, cables, adaptadores, accesorios, repuestos, electrónica y protección eléctrica en UltraTecno.',path:'/tienda'})
export default async function StorePage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const [products,categories,params]=await Promise.all([getPublicProducts(),getPublicCategories(),searchParams]);const first=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]||'':value||'';return <><Navbar/><main id="main"><ProductsCatalog initialProducts={products} initialCategories={categories} initialFilters={{q:first(params.q),category:first(params.category),stock:first(params.stock)==='1'}}/></main><Footer/></>}
