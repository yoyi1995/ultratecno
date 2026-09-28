import { permanentRedirect } from 'next/navigation'

export default async function LegacyProducts({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const values=await searchParams;const params=new URLSearchParams();for(const [key,value] of Object.entries(values)){if(Array.isArray(value))value.forEach(item=>params.append(key,item));else if(value)params.set(key,value)}permanentRedirect('/tienda'+(params.size?'?'+params.toString():''))}
