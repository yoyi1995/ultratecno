# UltraTecno

Sitio comercial y administrador de contenido para UltraTecno: catálogo, carrito con consulta por WhatsApp, servicios técnicos, cursos, consejos y CRUD privado.

## Requisitos e instalación

- Node.js 20.9 o superior.
- npm incluido con Node.js.

```powershell
npm ci --ignore-scripts
Copy-Item .env.example .env.local
```

Sin credenciales Supabase, `next dev` usa el catálogo demo local. No expongas el modo demo a Internet.

## Desarrollo local

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Abre <http://127.0.0.1:3000>. El administrador está en <http://127.0.0.1:3000/admin>.

Acceso demo predeterminado:

- Correo: `demo@ultratecno.local`
- Contraseña: `UltraTecnoDemo2026!`

Los cambios CRUD del demo se guardan en `.local/content.json` y las imágenes en `.local/media/`. Para detener el servidor, presiona `Ctrl+C` en su terminal.

## Build de producción local

```powershell
npm run build
$env:DEMO_MODE='true'
npm run start -- --hostname 127.0.0.1 --port 3000
```

`DEMO_MODE=true` solo habilita el administrador demo de `next start` en localhost. En Netlify, Vercel o cualquier entorno público el administrador requiere Supabase y el modo demo queda deshabilitado.

## Verificación

Con el servidor activo en el puerto 3000:

```powershell
npm run lint
node tests/qa-permissions.mjs
node tests/browser-check.mjs
```

La prueba de navegador usa Chrome por defecto. Puedes indicar otro Chromium instalado con `QA_CHROME`. Las capturas y resultados JSON se guardan en `project-state/ultratecno/qa/` cuando se ejecuta desde esta fábrica.

## Supabase, Cloudinary y despliegue

Copia las variables públicas del proyecto existente a `.env.local` y deja `DEMO_MODE=false`. Nunca uses una clave `service_role` ni publiques secretos. La migración aditiva, las políticas RLS, Cloudinary y los pasos para el mismo sitio Netlify están documentados en [docs/data-setup.md](docs/data-setup.md).

Cloudinary sigue siendo el proveedor de imágenes. `CLOUDINARY_API_SECRET` y `CLOUDINARY_API_KEY` se consumen únicamente en servidor; el código acepta temporalmente el nombre histórico `NEXT_PUBLIC_CLOUDINARY_API_KEY` para no romper la beta mientras se actualiza el entorno.
