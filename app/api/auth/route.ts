import { NextRequest, NextResponse } from 'next/server';
import { ApiError, client, configured, demoAllowed, demoToken, failure, jsonBody, mode, rateLimit, sameOrigin, session, setSession } from '@/lib/server-data';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){try{const current=await session(request);return NextResponse.json({user:current?{email:current.email}:null,mode,demoLogin:demoAllowed(request)},{headers:{'Cache-Control':'no-store'}});}catch(error){return failure(error);}}
export async function POST(request:NextRequest){try{sameOrigin(request);rateLimit(request);const body=await jsonBody(request);if(typeof body?.email!=='string'||typeof body?.password!=='string'||body.email.length>254||body.password.length>1024)throw new ApiError(400,'Introduce correo y contraseña válidos');
 let email:string;let token:string;let age=8*3600;
 if(!configured){if(!demoAllowed(request))throw new ApiError(403,'Configura Supabase para iniciar sesión en este despliegue');email=process.env.DEMO_ADMIN_EMAIL||'demo@ultratecno.local';if(body.email!==email||body.password!==(process.env.DEMO_ADMIN_PASSWORD||'UltraTecnoDemo2026!'))throw new ApiError(401,'Credenciales incorrectas');token=demoToken(email);}
 else {const {data,error}=await client().auth.signInWithPassword({email:body.email,password:body.password});if(error||!data.session||data.user?.app_metadata.role!=='admin')throw new ApiError(401,'Credenciales incorrectas o usuario sin permiso administrativo');email=data.user.email||body.email;token=data.session.access_token;age=data.session.expires_in;}
 return setSession(NextResponse.json({user:{email},mode}),token,age,request);
 }catch(error){return failure(error);}}
export async function DELETE(request:NextRequest){try{sameOrigin(request);return setSession(NextResponse.json({user:null,mode}),'',0,request);}catch(error){return failure(error);}}
