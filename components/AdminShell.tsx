'use client';

import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Button, Card, Input, Label } from '@heroui/react';
import { ArrowLeft, LockKeyhole, LogOut, Package, Shapes, Wrench, GraduationCap, PlaySquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Session = { user: { email: string } | null; mode: string; demoLogin: boolean };
const SessionContext = createContext<Session>({ user: null, mode: '', demoLogin: false });
export const useAdminSession = () => useContext(SessionContext);
export const adminSections = [
  { key: 'products', label: 'Productos', icon: Package, description: 'Catálogo, imágenes y disponibilidad' },
  { key: 'categories', label: 'Categorías', icon: Shapes, description: 'Organización y orden de la tienda' },
  { key: 'services', label: 'Servicios', icon: Wrench, description: 'Servicios técnicos y recomendaciones' },
  { key: 'courses', label: 'Cursos', icon: GraduationCap, description: 'Temarios, fechas y capacitaciones' },
  { key: 'tips', label: 'Videos / tips', icon: PlaySquare, description: 'Artículos y contenido audiovisual' },
] as const;

export default function AdminShell({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    let current = true;
    fetch('/api/auth', { cache: 'no-store' }).then(async response => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'No se pudo verificar la sesión.');
      if (current) setSession(body);
    }).catch(err => { if (current) setError(err instanceof Error ? err.message : 'Error de conexión'); });
    return () => { current = false; };
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'No se pudo iniciar sesión.');
      const verified = await fetch('/api/auth', { cache: 'no-store' });
      if (!verified.ok) throw new Error('No se pudo verificar la sesión.');
      setSession(await verified.json());
    } catch (err) { setError(err instanceof Error ? err.message : 'Error de conexión'); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth', { method: 'DELETE' });
      if (!response.ok) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.');
      setSession(previous => previous ? { ...previous, user: null } : null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Error de conexión'); }
    finally { setBusy(false); }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><Card className="max-w-md p-8"><p role={error ? 'alert' : 'status'}>{error || 'Verificando acceso…'}</p>{error && <Button onPress={() => window.location.reload()}>Reintentar</Button>}</Card></main>;
  if (!session.user) return <main className="grid min-h-screen place-items-center bg-[#071c45] px-5 py-12">
    <div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-blue-100"><ArrowLeft size={16} /> Volver a UltraTecno</Link>
      <Card className="rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><LockKeyhole /></div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">UltraTecno · Área privada</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Administración</h1><p className="mt-3 text-sm text-slate-600">Ingresa con tu acceso autorizado para gestionar el contenido.</p>
        <form data-testid="admin-login" onSubmit={login} className="mt-7 space-y-5">
          <div><Label htmlFor="admin-email">Correo electrónico</Label><Input id="admin-email" data-testid="admin-email" name="email" type="email" autoComplete="username" required fullWidth className="mt-2" /></div>
          <div><Label htmlFor="admin-password">Contraseña</Label><Input id="admin-password" data-testid="admin-password" name="password" type="password" autoComplete="current-password" required fullWidth className="mt-2" /></div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button data-testid="admin-submit" type="submit" fullWidth isDisabled={busy}>{busy ? 'Verificando…' : 'Entrar al panel'}</Button>
        </form>
        {session.demoLogin && <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-950"><strong>Demostración local</strong><p className="mt-1">Usa el acceso demo indicado en el README. Los cambios se guardan en este equipo.</p></div>}
      </Card>
    </div>
  </main>;
  return <SessionContext.Provider value={session}><div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5"><Link href="/admin" className="text-xl font-extrabold tracking-tight text-blue-950">ULTRATECNO <span className="ml-2 text-xs font-medium text-slate-500">Administración</span></Link><div className="flex flex-wrap items-center gap-4"><span className="text-xs text-slate-500">{session.user.email}</span><Link href="/" className="text-sm font-medium text-blue-700">Ver sitio</Link><Button variant="secondary" size="sm" onPress={logout} isDisabled={busy}><LogOut size={15} /> Salir</Button></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-7 px-5 py-7 lg:grid-cols-[210px_minmax(0,1fr)]"><aside><nav aria-label="Administración" className="flex flex-wrap gap-2 lg:flex-col">{adminSections.map(item => <Link key={item.key} data-testid={`admin-nav-${item.key}`} href={`/admin/${item.key}`} aria-current={pathname.startsWith(`/admin/${item.key}`) ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${pathname.startsWith(`/admin/${item.key}`) ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-white'}`}><item.icon size={18} />{item.label}</Link>)}</nav><div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-950">{session.mode === 'demo' ? 'Modo demo local. Catálogo de ejemplo; cambios persistentes en este equipo.' : 'Contenido conectado a Supabase. Solo se publica lo marcado como activo.'}</div></aside>
      <main className="min-w-0">{error && <p role="alert" className="mb-5 text-red-700">{error}</p>}{children}</main>
    </div>
  </div></SessionContext.Provider>;
}
