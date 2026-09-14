import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
import cloudinary from '@/lib/cloudinary';
import { ApiError,configured,demoAllowed,failure,localRoot,requireAdmin } from '@/lib/server-data';
const maxImageBytes=4*1024*1024;
export async function POST(request:NextRequest){try{await requireAdmin(request);if(Number(request.headers.get('content-length')||0)>maxImageBytes+20000)throw new ApiError(413,'Máximo 4 MB');const form=await request.formData();const file=form.get('file');if(!(file instanceof File)||file.size>maxImageBytes||file.size<12)throw new ApiError(400,'Selecciona una imagen de hasta 4 MB');const bytes=Buffer.from(await file.arrayBuffer());let ext='';if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&file.type==='image/png')ext='png';if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255&&file.type==='image/jpeg')ext='jpg';if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'&&file.type==='image/webp')ext='webp';if(!ext)throw new ApiError(400,'Formato no permitido. Usa PNG, JPEG o WebP');const name=`${randomUUID()}.${ext}`;let url:string;
 if(!configured){if(!demoAllowed(request))throw new ApiError(403,'Carga demo solo en localhost');await mkdir(path.join(localRoot,'media'),{recursive:true});await writeFile(path.join(localRoot,'media',name),bytes);url=`/api/media/${name}`;}
 else {if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||!(process.env.CLOUDINARY_API_KEY||process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)||!process.env.CLOUDINARY_API_SECRET)throw new ApiError(503,'Configuración Cloudinary incompleta');url=await new Promise<string>((resolve,reject)=>{cloudinary.uploader.upload_stream({folder:'ultratecno',resource_type:'image',transformation:[{width:1600,height:1600,crop:'limit',quality:'auto',fetch_format:'auto'}]},(error,result)=>{if(error||!result)reject(new ApiError(502,'No se pudo subir a Cloudinary'));else resolve(result.secure_url);}).end(bytes);});}
 return NextResponse.json({url});}catch(error){return failure(error);}}
