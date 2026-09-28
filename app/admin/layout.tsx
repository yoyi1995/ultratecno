import AdminShell from '@/components/AdminShell';
import type { Metadata } from 'next';

export const metadata:Metadata={title:'Administración UltraTecno',robots:{index:false,follow:false,nocache:true}};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
