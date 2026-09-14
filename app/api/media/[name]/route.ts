import { NextRequest,NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {localRoot,configured} from '@/lib/server-data';
export async function GET(_request:NextRequest,{params}:{params:Promise<{name:string}>}){const {name}=await params;if(configured||!/^[a-f0-9-]+\.(png|jpg|webp)$/.test(name))return new NextResponse(null,{status:404});try{const bytes=await readFile(path.join(localRoot,'media',name));const type=name.endsWith('.png')?'image/png':name.endsWith('.jpg')?'image/jpeg':'image/webp';return new NextResponse(bytes,{headers:{'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=3600'}});}catch{return new NextResponse(null,{status:404});}}
