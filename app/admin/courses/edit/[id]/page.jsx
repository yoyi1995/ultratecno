import AdminCollection from '@/components/AdminCollection';
export default async function Page({ params }) { const { id } = await params; return <AdminCollection collection='courses' initialEdit={id} />; }
