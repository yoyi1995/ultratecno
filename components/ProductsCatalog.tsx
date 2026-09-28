'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/react'
import { useContent } from '@/hooks/useContent'
import { ProductCard, ContentState } from '@/components/Catalog'
import { PageHeading } from '@/components/Site'
import type { Category, Product } from '@/lib/types'

type StoreFilters={q:string;category:string;stock:boolean}

export default function ProductsCatalog({initialProducts,initialCategories,initialFilters}:{initialProducts:Product[];initialCategories:Category[];initialFilters:StoreFilters}){
  const router=useRouter()
  const c=useContent('products',initialProducts)
  const categories=useContent('categories',initialCategories)
  const [filters,setFilters]=useState(initialFilters)
  const update=(key:keyof StoreFilters,value:string|boolean)=>{
    const next={...filters,[key]:value}
    setFilters(next)
    const params=new URLSearchParams()
    if(next.q)params.set('q',next.q)
    if(next.category)params.set('category',next.category)
    if(next.stock)params.set('stock','1')
    router.replace('/tienda'+(params.size?'?'+params.toString():''),{scroll:false})
  }
  const normalized=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  const data=c.data.filter(product=>(!filters.category||product.category===filters.category)&&(!filters.stock||product.in_stock)&&normalized(product.name+' '+product.description+' '+product.brand).includes(normalized(filters.q)))
  return <><PageHeading eyebrow="TIENDA ULTRATECNO" title="Tecnología y accesorios para tus equipos." description="Consulta productos disponibles y explora categorías de tintas, cables, adaptadores, accesorios, repuestos, electrónica y protección eléctrica."/><div className="wrap section catalog-layout"><aside className="catalog-filters"><h2>Categorías</h2><Button variant="ghost" className={!filters.category?'selected-filter':''} onPress={()=>update('category','')}>Todos los productos</Button>{categories.data.map(cat=><Button variant="ghost" key={cat.id} className={filters.category===cat.slug?'selected-filter':''} onPress={()=>update('category',cat.slug)}>{cat.name}</Button>)}<label className="stock-filter"><input type="checkbox" checked={filters.stock} onChange={event=>update('stock',event.target.checked)}/> Solo disponibles</label></aside><div><div className="catalog-toolbar"><label className="catalog-search"><span className="sr-only">Buscar en el catálogo</span><input value={filters.q} placeholder="Buscar producto, marca o descripción…" onChange={event=>update('q',event.target.value)}/></label><span>{data.length} productos</span></div>{c.mode==='demo'&&<p className="demo-note mb-5">Catálogo de demostración. Confirma precio y disponibilidad antes de comprar.</p>}<ContentState {...c} empty={!data.length}/>{!c.loading&&!c.error&&!data.length&&<Button onPress={()=>{setFilters({q:'',category:'',stock:false});router.replace('/tienda')}}>Limpiar filtros</Button>}<div className="product-grid catalog-products">{data.map(product=><ProductCard key={product.id} product={product}/>)}</div></div></div></>
}
