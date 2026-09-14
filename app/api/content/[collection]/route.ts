import { NextRequest, NextResponse } from 'next/server';
import { ApiError, client, collections, configured, demoAllowed, failure, jsonBody, mode, mutateDemo, readDemo, requireAdmin } from '@/lib/server-data';
import { validate, ValidationError } from '@/lib/validation';
import type { Collection } from '@/lib/types';
export const dynamic='force-dynamic';
type Context={params:Promise<{collection:string}>};
async function resolve(context:Context){const {collection}=await context.params;if(!collections.includes(collection as Collection))throw new ApiError(404,'Colección no encontrada');return collection as Collection;}
export async function GET(request:NextRequest,context:Context){try{const collection=await resolve(context);const admin=request.nextUrl.searchParams.get('admin')==='1';const user=admin?await requireAdmin(request):null;let data;
 if(configured){let query=client(user?.token).from(collection).select('*');if(!admin)query=query.eq('active',true);const result=await query;if(result.error)throw new ApiError(503,'No se pudo leer la colección. Revisa la migración y permisos Supabase.');data=result.data;}
 else {data=(await readDemo())[collection].filter(row=>admin||row.active);}
 if(collection==='categories')data.sort((a,b)=>Number(a.sort_order)-Number(b.sort_order));
 return NextResponse.json({data,mode},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return failure(error);}}
async function write(request:NextRequest,context:Context){try{const collection=await resolve(context);const user=await requireAdmin(request);const body=await jsonBody(request);if(!body||typeof body!=='object')throw new ApiError(400,'Registro inválido');
 if(request.method!=='POST'&& !['string','number'].includes(typeof body.id))throw new ApiError(400,'ID obligatorio');
 const record=request.method==='DELETE'?{id:body.id}:validate(collection,body);if(request.method==='PUT')record.id=body.id;
 let data;
 if(configured){const db=client(user.token);
  if(collection==='products'&&request.method!=='DELETE'){const category=await db.from('categories').select('id').eq('slug',String(record.category)).maybeSingle();if(category.error||!category.data)throw new ApiError(409,'Selecciona una categoría existente');}
  if(collection==='categories'&&request.method!=='POST'){const previous=await db.from('categories').select('slug').eq('id',body.id).maybeSingle();if(previous.error||!previous.data)throw new ApiError(404,'Registro no encontrado');if(request.method==='DELETE'||record.slug!==previous.data.slug){const used=await db.from('products').select('id').eq('category',previous.data.slug).limit(1);if(used.error)throw new ApiError(400,'No se pudo comprobar el uso de la categoría');if(used.data.length)throw new ApiError(409,'La categoría tiene productos. Reasígnalos antes de eliminar o cambiar su slug');}}
  let result;if(request.method==='POST')result=await db.from(collection).insert(record).select().single();else if(request.method==='PUT')result=await db.from(collection).update(record).eq('id',body.id).select().single();else result=await db.from(collection).delete().eq('id',body.id).select().single();if(result.error)throw new ApiError(result.error.code==='PGRST116'?404:400,'No se pudo guardar. Verifica campos, referencias y permisos.');data=result.data;}
 else {if(!demoAllowed(request))throw new ApiError(403,'La escritura demo está disponible solo en localhost');data=await mutateDemo(collection,request.method,record);}
 return NextResponse.json({data,mode},{status:request.method==='POST'?201:200});
 }catch(error){return error instanceof ValidationError?NextResponse.json({error:error.message},{status:400}):failure(error);}}
export const POST=write;export const PUT=write;export const DELETE=write;
