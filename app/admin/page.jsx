"use client";

import Link from 'next/link';
import { Card } from '@heroui/react';
import { ArrowUpRight, ExternalLink, ShieldCheck, Database, MessageCircle } from 'lucide-react';
import { adminSections, useAdminSession } from '@/components/AdminShell';
import { useContent } from '@/hooks/useContent';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

function CollectionStat({ collectionKey }) {
  const { data, loading } = useContent(collectionKey);
  if (loading) return <span className="text-xs text-slate-400 font-normal">Cargando…</span>;
  const activeCount = data.filter(item => item.active !== false).length;
  return (
    <span className="text-xs font-semibold text-slate-600">
      {data.length} total · <strong className="text-emerald-700">{activeCount} activos</strong>
    </span>
  );
}
export default function AdminPage() {
  const session = useAdminSession();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Tu espacio de trabajo</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Panel de Control UltraTecno</h1>
        <p className="mt-2 text-sm text-slate-500">
          Gestión centralizada de catálogo, reparaciones, cursos y tips técnicos.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Database size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Almacenamiento</p>
              <p className="text-sm font-bold text-slate-900">
                {session?.mode === 'demo' ? 'Modo Demo Local' : 'Supabase PostgreSQL'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Canal WhatsApp</p>
              <p className="text-sm font-bold text-slate-900">+{WHATSAPP_NUMBER}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Seguridad & RLS</p>
              <p className="text-sm font-bold text-slate-900">Protección Activa</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Collection Cards */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Colecciones de contenido</h2>
          <Link href="/products" target="_blank" className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
            Ver tienda pública <ExternalLink size={13} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {adminSections.map(section => (
            <Link key={section.key} href={`/admin/${section.key}`}>
              <Card className="group h-full gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-md">
                <div className="flex items-center justify-between text-blue-700">
                  <div className="rounded-xl bg-blue-50 p-3 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <section.icon size={24} />
                  </div>
                  <ArrowUpRight size={20} className="text-slate-400 transition-colors group-hover:text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{section.label}</h3>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <CollectionStat collectionKey={section.key} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
// Named component keeps readable labels in React diagnostics.
