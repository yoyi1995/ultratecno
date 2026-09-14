import type { Collection } from './types';
export class ValidationError extends Error {}
const fields:Record<Collection,string[]>={products:['name','description','price','category','brand','image_url','images','specifications','in_stock','featured','active'],categories:['name','slug','sort_order','image_url','active'],services:['title','category','image_url','description','includes','problems','recommendations','featured','active'],courses:['title','image_url','description','syllabus','level','modality','duration','start_date','schedule','seats','status','featured','active'],tips:['title','description','content','kind','url','image_url','category','active']};
export function validUrl(value:string){if(value==='')return true;if(/^\/api\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(value)||/^\/images\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/.test(value))return true;try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
export function validate(collection:Collection,body:Record<string,unknown>){
 if(!body||Array.isArray(body)||typeof body!=='object')throw new ValidationError('Registro inválido');
 const output:Record<string,unknown>={};
 for(const field of fields[collection]){
  const value=body[field];
  if(['active','featured','in_stock'].includes(field)){if(typeof value!=='boolean')throw new ValidationError(`${field}: se requiere verdadero o falso`);}
  else if(['price','sort_order','seats'].includes(field)){if(!(field==='seats'&&value===null) && (typeof value!=='number'||!Number.isFinite(value)||value<0||value>10000000||((field==='seats'||field==='sort_order')&&!Number.isInteger(value))))throw new ValidationError(`${field}: número no válido`);}
  else if(['images','includes','problems','recommendations','syllabus'].includes(field)){if(!Array.isArray(value)||value.length>50||value.some(v=>typeof v!=='string'||v.length>2000))throw new ValidationError(`${field}: lista inválida`);if(field==='images'&&(value as string[]).some(v=>!validUrl(v)))throw new ValidationError('URL de imagen inválida');}
  else if(field==='specifications'){if(!value||typeof value!=='object'||Array.isArray(value)||Object.entries(value).length>50||Object.entries(value).some(([k,v])=>k.length>100||typeof v!=='string'||v.length>2000))throw new ValidationError('Especificaciones inválidas');}
  else if(field==='start_date'){if(value!==null&&(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value))))throw new ValidationError('Fecha inválida');}
  else {if(typeof value!=='string'||value.length>12000)throw new ValidationError(`${field}: texto inválido`);if(['name','title','slug','category'].includes(field)&&!value.trim())throw new ValidationError(`${field}: obligatorio`);if(['image_url','url'].includes(field)&&!validUrl(value))throw new ValidationError('Usa una URL HTTPS válida');}
  output[field]=typeof value==='string'?value.trim():value;
 }
 if(collection==='products'&&Math.abs(Number(output.price)*100-Math.round(Number(output.price)*100))>0.000001)throw new ValidationError('Precio: máximo dos decimales');
 if(collection==='categories'&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(output.slug)))throw new ValidationError('Slug inválido');
 if(collection==='courses'&&!['upcoming','open','closed'].includes(String(output.status)))throw new ValidationError('Estado inválido');
 if(collection==='tips'&&!['article','youtube','video'].includes(String(output.kind)))throw new ValidationError('Tipo inválido');
 if(collection==='tips'&&output.kind!=='article'&&!output.url)throw new ValidationError('El video requiere una URL');
 if(collection==='tips'&&output.kind!=='article'){let url:URL;try{url=new URL(String(output.url));}catch{throw new ValidationError('El video requiere URL HTTPS');}if(url.protocol!=='https:')throw new ValidationError('El video requiere URL HTTPS');if(output.kind==='youtube'){const id=url.hostname==='youtu.be'?url.pathname.slice(1):['youtube.com','www.youtube.com'].includes(url.hostname)?(url.pathname==='/watch'?url.searchParams.get('v'):url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)$/)?.[1]):null;if(!id||!/^[\w-]{11}$/.test(id))throw new ValidationError('URL de YouTube inválida');}}
 return output;
}
