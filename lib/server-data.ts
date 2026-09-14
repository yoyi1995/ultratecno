import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { demoData, type Database } from './demo-data';
import type { Collection } from './types';

const globalState = globalThis as typeof globalThis & { ultraKey?:Buffer; ultraQueue?:Promise<unknown>; ultraAttempts?:Map<string,{count:number;until:number}> };
const key = globalState.ultraKey ??= randomBytes(32);
export const cookieName='ultratecno_session';
export const localRoot=path.join(process.cwd(),'.local');
const databasePath=path.join(localRoot,'content.json');
export const collections: Collection[]=['products','categories','services','courses','tips'];
const localDemoOverride=process.env.DEMO_MODE==='true'&&!process.env.NETLIFY&&!process.env.VERCEL;
export const configured=!localDemoOverride&&Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY));
export const mode=configured?'supabase':'demo';
export class ApiError extends Error { constructor(public status:number,message:string){super(message);} }
export function isLocal(request:NextRequest){ const host=request.headers.get('host')?.split(':')[0]; return !process.env.NETLIFY && !process.env.VERCEL && ['localhost','127.0.0.1'].includes(host||'') && (process.env.NODE_ENV!=='production'||process.env.DEMO_MODE==='true'); }
export function demoAllowed(request:NextRequest){return !configured && isLocal(request);}
export function sameOrigin(request:NextRequest){const origin=request.headers.get('origin');if(!origin)return;let source:URL;try{source=new URL(origin);}catch{throw new ApiError(403,'Origen no permitido');}const target=new URL(request.url);const forwardedHost=request.headers.get('x-forwarded-host')?.split(',')[0].trim();const expectedHost=forwardedHost||request.headers.get('host')||target.host;const expectedProtocol=(request.headers.get('x-forwarded-proto')?.split(',')[0].trim()||target.protocol.replace(':',''))+':';const [expectedName,expectedPort='']=expectedHost.toLowerCase().split(':');const sourcePort=source.port||(source.protocol==='https:'?'443':'80');const targetPort=expectedPort||(expectedProtocol==='https:'?'443':'80');const loopback=['localhost','127.0.0.1'].includes(source.hostname)&&['localhost','127.0.0.1'].includes(expectedName)&&sourcePort===targetPort;if(!loopback&&(source.host.toLowerCase()!==expectedHost.toLowerCase()||source.protocol!==expectedProtocol))throw new ApiError(403,'Origen no permitido');}
export function client(token?:string){ if(!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY))throw new ApiError(503,'Configuración Supabase incompleta: faltan URL o clave pública'); return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,{auth:{persistSession:false,autoRefreshToken:false},global:token?{headers:{Authorization:`Bearer ${token}`}}:undefined}); }
function sign(value:string){return createHmac('sha256',key).update(value).digest('base64url');}
export function demoToken(email:string){const value=Buffer.from(JSON.stringify({email,exp:Date.now()+8*3600000})).toString('base64url');return `${value}.${sign(value)}`;}
export async function session(request:NextRequest){
 const token=request.cookies.get(cookieName)?.value;
 if(!token)return null;
 if(!configured){if(!demoAllowed(request))return null;try{const [value,signature]=token.split('.');const expected=sign(value);if(signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;const payload=JSON.parse(Buffer.from(value,'base64url').toString());return payload.exp>Date.now()?{email:String(payload.email),token}:null;}catch{return null;}}
 const {data,error}=await client().auth.getUser(token);if(error||!data.user||data.user.app_metadata.role!=='admin')return null;return {email:data.user.email||'',token};
}
export async function requireAdmin(request:NextRequest){sameOrigin(request);const user=await session(request);if(!user)throw new ApiError(401,'Inicia sesión como administrador');return user;}
export function setSession(response:NextResponse,token:string,maxAge:number,request:NextRequest){response.cookies.set(cookieName,token,{httpOnly:true,sameSite:'strict',secure:new URL(request.url).protocol==='https:',path:'/',maxAge});return response;}
export function rateLimit(request:NextRequest){const attempts=globalState.ultraAttempts??=new Map();const id=request.headers.get('x-forwarded-for')?.split(',')[0]||'local';const now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);const value=attempts.get(id)||{count:0,until:now+60000};if(value.count>=10)throw new ApiError(429,'Demasiados intentos. Espera un minuto.');value.count++;attempts.set(id,value);}
export function failure(error:unknown){ if(error instanceof ApiError)return NextResponse.json({error:error.message},{status:error.status}); console.error('UltraTecno API failure:',error instanceof Error?error.name:'unknown');return NextResponse.json({error:'No se pudo completar la operación. Revisa la configuración del servidor.'},{status:500}); }
export async function jsonBody(request:NextRequest){if(Number(request.headers.get('content-length')||0)>128000)throw new ApiError(413,'Contenido demasiado grande');const text=await request.text();if(text.length>128000)throw new ApiError(413,'Contenido demasiado grande');try{const value=JSON.parse(text);if(!value||typeof value!=='object'||Array.isArray(value))throw new Error();return value as Record<string,unknown>;}catch{throw new ApiError(400,'JSON inválido');}}
function normalizeDemo(database:Database):Database{const categoryImages=new Map(demoData.categories.map(row=>[row.slug,row.image_url]));return {...database,categories:database.categories.map(row=>({...row,image_url:row.image_url||categoryImages.get(row.slug)||''})),services:database.services.map(row=>({...row,featured:row.featured??false}))};}
export async function readDemo():Promise<Database>{try{return normalizeDemo(JSON.parse(await readFile(databasePath,'utf8')));}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return structuredClone(demoData);throw error;}}
export async function mutateDemo(collection:Collection,method:string,record:Record<string,unknown>){
 const run=async()=>{const db=await readDemo();const rows=db[collection] as unknown as Record<string,unknown>[];let result:Record<string,unknown>|null=null;
 if(collection==='categories'){const previous=db.categories.find(row=>String(row.id)===String(record.id));if(method!=='DELETE'&&db.categories.some(row=>row.slug===record.slug&&String(row.id)!==String(record.id)))throw new ApiError(409,'Ya existe una categoría con este slug');if(previous&&(method==='DELETE'||record.slug!==previous.slug)&&db.products.some(row=>row.category===previous.slug))throw new ApiError(409,'La categoría tiene productos. Reasígnalos antes de eliminar o cambiar su slug');}
 if(collection==='products'&&method!=='DELETE'&&!db.categories.some(row=>row.slug===record.category))throw new ApiError(409,'Selecciona una categoría existente');
 if(method==='POST'){result={...record,id:randomUUID()};rows.push(result);}else{const index=rows.findIndex(row=>String(row.id)===String(record.id));if(index<0)throw new ApiError(404,'Registro no encontrado');if(method==='DELETE')rows.splice(index,1);else{result={...record,id:rows[index].id};rows[index]=result;}}
 await mkdir(localRoot,{recursive:true});const tmp=`${databasePath}.${randomUUID()}.tmp`;await writeFile(tmp,JSON.stringify(db,null,2),'utf8');await rename(tmp,databasePath);return result;};
 const pending=(globalState.ultraQueue||Promise.resolve()).then(run,run);globalState.ultraQueue=pending.catch(()=>{});return pending;
}
