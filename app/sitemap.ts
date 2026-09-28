import type { MetadataRoute } from 'next'
import { getPublicCategories, getPublicProducts } from '@/lib/public-data'
import { absoluteUrl, productSlug } from '@/lib/seo'

export const revalidate=3600
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const pages:MetadataRoute.Sitemap=[['/',1,'weekly'],['/tienda',0.9,'daily'],['/mantenimiento',0.9,'monthly'],['/reparaciones',0.9,'monthly'],['/cursos',0.7,'weekly'],['/consejos',0.6,'weekly'],['/quienes-somos',0.5,'yearly'],['/contact',0.5,'yearly']].map(([path,priority,changeFrequency])=>({url:absoluteUrl(String(path)),priority:Number(priority),changeFrequency:changeFrequency as 'daily'|'weekly'|'monthly'|'yearly'}));const [categories,products]=await Promise.allSettled([getPublicCategories(),getPublicProducts()]);if(categories.status==='fulfilled')pages.push(...categories.value.map(category=>({url:absoluteUrl(`/categoria/${category.slug}`),changeFrequency:'weekly' as const,priority:0.7})));if(products.status==='fulfilled')pages.push(...products.value.map(product=>({url:absoluteUrl(`/productos/${productSlug(product)}`),changeFrequency:'daily' as const,priority:0.8})));return pages}
