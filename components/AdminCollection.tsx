'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Button, Card, Input, Label, TextArea, Modal, Select, ListBox } from '@heroui/react';
import { Plus, Pencil, Trash2, Upload, ArrowLeft, Save, Search, Check } from 'lucide-react';
import type { Category, Collection, ContentMap } from '@/lib/types';
import { adminSections } from './AdminShell';

type Entity = ContentMap[Collection];
type Field = { key: string; label: string; type?: 'number' | 'date' | 'text' | 'textarea' | 'list' | 'specs' | 'select'; required?: boolean; options?: [string, string][]; hint?: string };
type Draft = Record<string, string | boolean>;
const fields: Record<Collection, Field[]> = {
  products: [{ key: 'name', label: 'Nombre', required: true }, { key: 'category', label: 'Categoría', type: 'select', required: true }, { key: 'brand', label: 'Marca' }, { key: 'price', label: 'Precio (USD)', type: 'number', required: true }, { key: 'description', label: 'Descripción', type: 'textarea', required: true }, { key: 'specifications', label: 'Especificaciones', type: 'specs', hint: 'Una por línea: característica: valor' }, { key: 'images', label: 'Galería de imágenes', type: 'list', hint: 'Una URL por línea. La imagen principal se configura a la derecha.' }],
  categories: [{ key: 'name', label: 'Nombre', required: true }, { key: 'slug', label: 'Identificador de categoría', required: true, hint: 'Minúsculas, números y guiones. Ejemplo: laptops' }, { key: 'sort_order', label: 'Orden', type: 'number', required: true }],
  services: [{ key: 'title', label: 'Título', required: true }, { key: 'category', label: 'Categoría del servicio', required: true }, { key: 'description', label: 'Descripción', type: 'textarea', required: true }, { key: 'includes', label: 'Qué incluye', type: 'list', hint: 'Un punto por línea' }, { key: 'problems', label: 'Problemas frecuentes', type: 'list', hint: 'Un problema por línea' }, { key: 'recommendations', label: 'Recomendaciones', type: 'list', hint: 'Una recomendación por línea' }],
  courses: [{ key: 'title', label: 'Título', required: true }, { key: 'description', label: 'Descripción', type: 'textarea', required: true }, { key: 'syllabus', label: 'Temario', type: 'list', hint: 'Un tema por línea' }, { key: 'level', label: 'Nivel', required: true }, { key: 'modality', label: 'Modalidad', required: true }, { key: 'duration', label: 'Duración' }, { key: 'start_date', label: 'Fecha de inicio', type: 'date', hint: 'Déjala vacía para mostrar Próximamente.' }, { key: 'schedule', label: 'Horario' }, { key: 'seats', label: 'Cupos', type: 'number', hint: 'Vacío si aún no está definido.' }, { key: 'status', label: 'Estado', type: 'select', options: [['upcoming', 'Próximamente'], ['open', 'Inscripciones abiertas'], ['closed', 'Cerrado']] }],
  tips: [{ key: 'title', label: 'Título', required: true }, { key: 'description', label: 'Descripción breve', type: 'textarea', required: true }, { key: 'category', label: 'Categoría', required: true }, { key: 'kind', label: 'Tipo', type: 'select', options: [['article', 'Artículo'], ['youtube', 'YouTube'], ['video', 'Mini video']] }, { key: 'url', label: 'URL del video', hint: 'YouTube o archivo de video HTTPS. Vacío para artículos.' }, { key: 'content', label: 'Contenido del consejo', type: 'textarea' }],
};

function makeDraft(collection: Collection, entity?: Entity): Draft {
  const result: Draft = { active: true, in_stock: true, featured: false, image_url: '', status: 'upcoming', kind: 'article', sort_order: '0', price: '0' };
  for (const field of fields[collection]) if (!(field.key in result)) result[field.key] = '';
  if (entity) for (const [key, value] of Object.entries(entity)) {
    result[key] = typeof value === 'boolean' ? value : Array.isArray(value) ? value.join('\n') : value && typeof value === 'object' ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n') : value == null ? '' : String(value);
  }
  return result;
}

function SelectField({ id, name, label, value, options, onChange }: { id: string; name: string; label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return <Select id={id} name={name} aria-label={label} value={value || null} onChange={key => onChange(String(key ?? ''))} fullWidth><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger><Select.Popover><ListBox>{options.map(([key, text]) => <ListBox.Item id={key} key={key} textValue={text}>{text}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover></Select>;
}

export default function AdminCollection({ collection, initialEdit }: { collection: Collection; initialEdit?: string }) {
  const [items, setItems] = useState<Entity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Entity | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Entity | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => makeDraft(collection));
  const [initialOpened, setInitialOpened] = useState(false);
  const section = adminSections.find(item => item.key === collection)!;
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/${collection}?admin=1`, { cache: 'no-store' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'No se pudo cargar el contenido.');
      setItems(body.data);
      if (collection === 'products') {
        const categoryResponse = await fetch('/api/content/categories?admin=1', { cache: 'no-store' });
        const categoryBody = await categoryResponse.json();
        if (!categoryResponse.ok) throw new Error(categoryBody.error || 'No se pudieron cargar las categorías.');
        setCategories(categoryBody.data);
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Error de conexión'); }
    finally { setLoading(false); }
  }, [collection]);
  useEffect(() => {
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [reload]);
  useEffect(() => {
    if (initialEdit && !loading && !initialOpened) {
      const timer = window.setTimeout(() => {
        const selected = initialEdit === 'new' ? 'new' : items.find(item => String(item.id) === initialEdit);
        if (selected) { setEditing(selected); setDraft(makeDraft(collection, selected === 'new' ? undefined : selected)); }
        else setError('El registro solicitado no existe.');
        setInitialOpened(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [initialEdit, initialOpened, loading, items, collection]);
  function openEditor(entity: Entity | 'new') { setError(''); setNotice(''); setEditing(entity); setDraft(makeDraft(collection, entity === 'new' ? undefined : entity)); }
  function setField(key: string, value: string | boolean) { setDraft(previous => ({ ...previous, [key]: value })); }
  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const data = new FormData(); data.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'No se pudo subir la imagen.');
      setField('image_url', body.url); setNotice('Imagen subida. Guarda el registro para publicarla.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Error al subir imagen'); }
    finally { setUploading(false); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const body: Record<string, unknown> = { active: draft.active === true };
      for (const field of fields[collection]) {
        const text = String(draft[field.key] ?? '').trim();
        if (field.required && !text) throw new Error(`Completa ${field.label.toLowerCase()}.`);
        if (field.type === 'list') body[field.key] = text.split('\n').map(line => line.trim()).filter(Boolean);
        else if (field.type === 'specs') {
          const pairs = text.split('\n').filter(line => line.trim()).map(line => {
            const separator = line.indexOf(':');
            if (separator < 1 || !line.slice(separator + 1).trim()) throw new Error('Usa característica: valor en cada especificación.');
            return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
          });
          body[field.key] = Object.fromEntries(pairs);
        } else if (field.type === 'number') {
          const value = text === '' && field.key === 'seats' ? null : Number(text);
          if (value !== null && (!Number.isFinite(value) || value < 0 || (field.key !== 'price' && !Number.isInteger(value)))) throw new Error(`Revisa ${field.label.toLowerCase()}.`);
          body[field.key] = value;
        } else body[field.key] = field.type === 'date' && !text ? null : text;
      }
      body.image_url = String(draft.image_url || '').trim();
      if (collection === 'products') body.in_stock = draft.in_stock === true;
      if (collection === 'products' || collection === 'services' || collection === 'courses') body.featured = draft.featured === true;
      if (editing && editing !== 'new') body.id = editing.id;
      const response = await fetch(`/api/content/${collection}`, { method: editing === 'new' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar.');
      setEditing(null); setNotice('Cambios guardados correctamente.'); await reload();
    } catch (err) { setError(err instanceof Error ? err.message : 'Error de conexión'); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/content/${collection}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleting.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar.');
      setDeleting(null); setNotice('Registro eliminado.'); await reload();
    } catch (err) { setDeleting(null); setError(err instanceof Error ? err.message : 'Error de conexión'); }
    finally { setBusy(false); }
  }
  const filtered = items.filter(item => ('name' in item ? item.name : item.title).toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  return <>
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Gestión de contenido</p><h1 className="mt-2 text-3xl font-bold">{section.label}</h1><p className="mt-2 text-sm text-slate-500">{section.description}</p></div>{!editing && <Button data-testid="admin-create" onPress={() => openEditor('new')}><Plus size={17} /> Crear nuevo</Button>}</div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><Check size={17} />{notice}</div>}
    {editing ? <form data-testid="admin-editor" onSubmit={save}><Button type="button" variant="ghost" onPress={() => setEditing(null)} isDisabled={busy || uploading} className="mb-4"><ArrowLeft size={16} /> Volver al listado</Button><div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]"><Card className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">{editing === 'new' ? 'Nuevo registro' : 'Editar registro'}</h2>{fields[collection].map(field => <div key={field.key}><Label htmlFor={`field-${field.key}`}>{field.label}{field.required ? ' *' : ''}</Label><div className="mt-2">{field.type === 'select' ? <SelectField id={`field-${field.key}`} name={field.key} label={field.label} value={String(draft[field.key] || '')} options={field.options || categories.map(category => [category.slug, `${category.name}${category.active ? '' : ' (inactiva)'}`])} onChange={value => setField(field.key, value)} /> : ['textarea', 'list', 'specs'].includes(field.type || '') ? <TextArea id={`field-${field.key}`} name={field.key} fullWidth rows={field.key === 'content' ? 7 : 4} required={field.required} value={String(draft[field.key] ?? '')} onChange={event => setField(field.key, event.target.value)} /> : <Input id={`field-${field.key}`} name={field.key} fullWidth type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} step={field.key === 'price' ? '0.01' : field.type === 'number' ? '1' : undefined} required={field.required} value={String(draft[field.key] ?? '')} onChange={event => setField(field.key, event.target.value)} />}</div>{field.hint && <p className="mt-1.5 text-xs text-slate-500">{field.hint}</p>}</div>)}</Card><div className="space-y-5">
      <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Imagen principal</h2>{draft.image_url && <img src={String(draft.image_url)} alt="Vista previa del contenido" className="aspect-square w-full rounded-xl bg-slate-50 object-contain" />}<div><Label htmlFor="field-image_url">URL de imagen</Label><Input id="field-image_url" name="image_url" fullWidth value={String(draft.image_url || '')} onChange={event => setField('image_url', event.target.value)} className="mt-2" /></div><Label htmlFor="admin-upload" className="flex items-center gap-2"><Upload size={15} />Subir imagen</Label><Input id="admin-upload" name="file" type="file" accept="image/jpeg,image/png,image/webp" fullWidth disabled={uploading} onChange={event => void upload(event.target.files?.[0])} /><p className="text-xs text-slate-500">{uploading ? 'Subiendo imagen…' : 'JPG, PNG o WebP. Máximo 4 MB.'}</p></Card>
      <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Publicación</h2>{[['active', 'Activo / visible'], ...(collection === 'products' ? [['in_stock', 'Disponible']] : []), ...(['products', 'services', 'courses'].includes(collection) ? [['featured', 'Destacado']] : [])].map(([key, label]) => <Button key={key} name={key} type="button" aria-pressed={draft[key] === true} variant={draft[key] ? 'primary' : 'secondary'} onPress={() => setField(key, !draft[key])} fullWidth className="justify-between"><span>{label}</span><span>{draft[key] ? 'Sí' : 'No'}</span></Button>)}<p className="text-xs leading-relaxed text-slate-500">Los registros inactivos permanecen en el panel y no se publican.</p></Card>
      <Button data-testid="admin-save" type="submit" fullWidth isDisabled={busy || uploading}><Save size={17} />{busy ? 'Guardando…' : 'Guardar cambios'}</Button><Button type="button" variant="secondary" fullWidth isDisabled={busy || uploading} onPress={() => setEditing(null)}>Cancelar</Button></div></div></form> : <>
      <div className="mb-5 flex items-center gap-3"><Search size={18} className="text-slate-400" /><Input aria-label="Buscar en el listado" placeholder="Buscar en el listado…" value={search} onChange={event => setSearch(event.target.value)} fullWidth /></div>
      {loading ? <p role="status" className="py-12 text-center text-slate-500">Cargando contenido…</p> : filtered.length === 0 ? <Card className="p-10 text-center"><p>No hay registros para esta búsqueda.</p><Button variant="secondary" onPress={reload}>Actualizar listado</Button></Card> : <div className="space-y-3">{filtered.map(item => <Card key={item.id} data-testid="admin-row" className="flex flex-row flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">{'image_url' in item && item.image_url && <img src={item.image_url} alt="" className="h-14 w-14 rounded-lg bg-slate-50 object-cover" />}<div className="min-w-0 flex-1 basis-36"><h2 className="break-words font-semibold">{'name' in item ? item.name : item.title}</h2><div className="mt-1 flex flex-wrap gap-2 text-xs"><span className={item.active ? 'text-emerald-700' : 'text-slate-500'}>{item.active ? 'Activo' : 'Inactivo'}</span>{'featured' in item && item.featured && <span className="text-blue-700">Destacado</span>}{'price' in item && <span className="text-slate-600">${Number(item.price).toFixed(2)}</span>}{'sort_order' in item && <span className="text-slate-600">Orden: {item.sort_order}</span>}</div></div><div className="flex gap-2"><Button data-testid="admin-edit" variant="secondary" size="sm" aria-label={`Editar ${'name' in item ? item.name : item.title}`} onPress={() => openEditor(item)}><Pencil size={15} />Editar</Button><Button data-testid="admin-delete" variant="ghost" size="sm" aria-label={`Eliminar ${'name' in item ? item.name : item.title}`} onPress={() => { setError(''); setDeleting(item); }} className="text-red-700"><Trash2 size={15} />Eliminar</Button></div></Card>)}</div>}
    </>}
    <Modal isOpen={Boolean(deleting)} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><Modal.Backdrop isDismissable={!busy}><Modal.Container size="sm"><Modal.Dialog><Modal.Header><Modal.Heading>Eliminar registro</Modal.Heading></Modal.Header><Modal.Body><p>¿Eliminar «{deleting && ('name' in deleting ? deleting.name : deleting.title)}»? Esta acción no se puede deshacer.</p></Modal.Body><Modal.Footer><Button variant="secondary" isDisabled={busy} onPress={() => setDeleting(null)}>Cancelar</Button><Button data-testid="admin-confirm-delete" variant="danger" isDisabled={busy} onPress={remove}>{busy ? 'Eliminando…' : 'Eliminar registro'}</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
  </>;
}
