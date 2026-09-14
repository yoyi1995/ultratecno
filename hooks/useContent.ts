'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Collection, ContentMap } from '@/lib/types';
export function useContent<K extends Collection>(collection: K) {
  const [data,setData] = useState<ContentMap[K][]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [mode,setMode] = useState('demo');
  const [revision,setRevision] = useState(0);
  const reload = useCallback(() => { setLoading(true); setError(null); setRevision(x=>x+1); },[]);
  useEffect(()=> { const controller=new AbortController();
    fetch(`/api/content/${collection}`,{signal:controller.signal,cache:'no-store'}).then(async response=>{const body=await response.json(); if(!response.ok) throw new Error(body.error||'No se pudo cargar el contenido'); setData(body.data); setMode(body.mode);}).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[collection,revision]);
  return {data,loading,error,reload,mode};
}
