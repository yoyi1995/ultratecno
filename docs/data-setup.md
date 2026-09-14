# Infraestructura existente de UltraTecno

La aplicación conserva el Supabase, Cloudinary, GitHub y sitio Netlify de la beta. Las pantallas consumen `/api/content/{products,categories,services,courses,tips}`. GET público devuelve solo filas activas; `?admin=1`, POST, PUT, DELETE y `/api/upload` requieren una sesión cuyo `app_metadata.role` sea `admin`. El JWT del usuario llega a Supabase, por lo que RLS continúa siendo la última barrera. No se usa `service_role` en la aplicación.

## Estado real inspeccionado

- Supabase contiene dos productos y un curso de la beta; no está vacío.
- Las tablas beta `products` y `courses` conservan sus columnas históricas. Todavía no tienen `active` ni los campos editoriales modernos.
- `categories`, `services` y `tips` aún no existen.
- Auth por email responde, pero el registro público continúa habilitado.
- Cloudinary autentica correctamente y ya contiene activos UltraTecno.
- El mismo sitio Netlify sirve `main`; no se debe importar ni crear otro sitio.

No se pudieron listar `auth.users`, `pg_policies`, triggers ni funciones con la clave pública. Esos controles deben hacerse desde el proyecto existente en Supabase antes de ejecutar SQL.

## Migración aditiva

1. Genera un respaldo del proyecto Supabase existente y revisa `pg_policies`, triggers, funciones, restricciones y columnas adicionales desde SQL Editor.
2. Revisa y ejecuta `supabase/migrations/20260910_commercial.sql` en ese mismo proyecto. El archivo no elimina tablas, columnas, políticas ni filas. Amplía `products`/`courses`, crea las tres tablas faltantes, añade imágenes a categorías y `featured` a servicios.
3. La migración crea las siete categorías públicas requeridas sin sobrescribir slugs existentes. Las referencias históricas `repuestos` y `tintas` se preservan como categorías inactivas para no añadir tarjetas al Home ni dejar productos huérfanos.
4. No crea bucket ni políticas de Supabase Storage. Todas las imágenes administrativas siguen pasando por Cloudinary.
5. No añadas una FK entre `products.category` y `categories.slug` hasta revisar y alinear todas las referencias históricas. La API ya impide seleccionar una categoría inexistente o eliminar/cambiar un slug en uso.
6. Para publicar el catálogo base de las dos páginas de servicio, despliega primero la versión que separa `category=mantenimiento` de `category=reparacion` y aplica después `supabase/migrations/20260914_service_catalogs.sql`. Esta segunda migración solo inserta filas faltantes por combinación de categoría y título; no sobrescribe ni elimina contenido existente.

Mientras esa semilla no esté aplicada, las páginas públicas muestran el mismo catálogo base incluido en la aplicación cuando su categoría todavía no tiene filas remotas. En cuanto exista contenido activo de esa categoría en `services`, Supabase pasa a ser la fuente visible y `/admin/services` permite editarlo normalmente.

## Administrador y RLS

1. En Authentication / Users, localiza primero el administrador existente. No crees otro usuario si ya existe.
2. Comprueba su `raw_app_meta_data`. Solo si falta, asigna `{"role":"admin"}` desde una sesión administrativa segura y vuelve a iniciar sesión para renovar el JWT.
3. Desactiva “Allow new users to sign up” en Authentication / Providers / Email: el sitio público no ofrece registro.
4. Después de aplicar la migración, prueba:
   - anon puede leer filas activas y no ve inactivas;
   - anon no puede insertar, actualizar ni eliminar;
   - un usuario autenticado sin rol admin tampoco puede mutar;
   - admin puede CRUD en las cinco colecciones;
   - el cambio de slug o eliminación de una categoría usada se rechaza.
5. Usa registros `QA_TEST_...` y elimínalos al terminar. No modifiques contenido comercial para probar.

## Cloudinary existente

Variables requeridas, sin incluir sus valores en Git:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

La beta guardaba la API key con el nombre `NEXT_PUBLIC_CLOUDINARY_API_KEY`. La aplicación acepta ese alias temporalmente, pero Netlify y `.env.local` deben migrarse a `CLOUDINARY_API_KEY`. El secret nunca debe usar prefijo `NEXT_PUBLIC_`. `/api/upload` valida sesión admin, firma binaria y MIME, admite JPEG/PNG/WebP hasta 4 MB y sube al prefijo `ultratecno`; el límite de 4 MB evita superar el máximo efectivo de payload binario de Netlify Functions.

## Demo local

Sin variables Supabase hay catálogo de ejemplo; precios e inventario no son una oferta real. En `next dev` sobre localhost/127.0.0.1 se usa el login demo descrito en README. CRUD se guarda en `.local/content.json` e imágenes en `.local/media`, nunca en Git. `DEMO_MODE=true` solo habilita el demo con `next start` en localhost; Netlify/Vercel lo deshabilitan.

## Mismo Netlify

No existe `netlify.toml` en el repositorio ni en su historial. El sitio actual ya detecta Next.js/OpenNext y construye desde `main`. Antes del próximo push confirma dentro del sitio Netlify existente:

- repositorio `yoyi1995/ultratecno`;
- rama de producción `main`;
- base en la raíz, build `npm run build` y publicación `.next`;
- Node 20.9 o superior;
- variables Supabase y Cloudinary del mismo proyecto/cuenta, con `DEMO_MODE=false`.

El deploy actual corresponde a `e4c2880`, commit que contenía el cargador PostCSS retirado en el commit local `17e741d`. Antes de desplegar, revisa logs/actividad del build y rota preventivamente los secretos que estuvieron disponibles para aquel build, en especial Cloudinary. Luego actualiza esas variables en el mismo sitio. No publiques hasta completar este control.

Referencias: [Supabase getUser](https://supabase.com/docs/reference/javascript/auth-getuser), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Netlify Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [límites de Functions](https://docs.netlify.com/build/functions/configuration/).
