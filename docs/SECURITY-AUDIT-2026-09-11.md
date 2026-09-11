# Auditoría estática del incidente PostCSS

Fecha: 11 de septiembre de 2026. Repositorio: `yoyi1995/ultratecno`.
Base examinada: `e4c28807b125e09a6a3659ecf6292d34a517af65` y cambios locales de modernización todavía sin terminar.

## Resultado y alcance

Se encontró **un cargador remoto malicioso confirmado**, en `postcss.config.mjs` de la base Git. Se retiró y se restauró exactamente la configuración legítima anterior. El barrido del código propio actual y de todas las versiones disponibles en Git no identificó otro cargador equivalente.

Se inspeccionaron los 10 commits alcanzables por todas las referencias locales, 137 blobs distintos correspondientes a 118 rutas históricas y 147 archivos del árbol de trabajo (incluidos archivos nuevos, ocultos y `dist/`, excluyendo de ese conteo `.git`, `.next` y `node_modules`). Las dependencias instaladas y artefactos se inventariaron por separado. `git fsck --full --no-reflogs --unreachable` terminó con código 0 y no reportó objetos inalcanzables ni errores.

La inspección fue **estática y sin conexión a los destinos del cargador**: lectura de archivos, JSON, hashes, expresiones de búsqueda y objetos Git. No se ejecutó npm, Next.js, pruebas ni scripts del proyecto durante esta auditoría. El analizador externo utilizó Python aislado (`-I -S`), sin importar módulos del repositorio. No se solicitaron ni incorporaron credenciales Supabase.

Este resultado no certifica la integridad del equipo, no descarta una segunda etapa ejecutada anteriormente y no constituye una auditoría exhaustiva del código nativo o de cada dependencia de terceros. La modernización sigue sin validar; no se declara el producto listo para producción.

## Hallazgo confirmado

| Campo | Evidencia |
| --- | --- |
| Archivo | `postcss.config.mjs`, línea 11 del archivo contaminado, después de numerosos tabuladores |
| Introducción | `e4c28807b125e09a6a3659ecf6292d34a517af65` |
| Fecha de autor Git | 2026-07-24 18:20:44 -0500 |
| Mensaje del commit | `feat: Agregar modales flotantes con detalles de servicios en pagina de reparaciones` |
| Blob malicioso | `674832aefa732aebe9f7afa9618ba7cc2e06dff6` |
| SHA-256 del archivo malicioso | `0138da4a50a7f483830187977dde340a26a6f9e170d564d73a3207339d22b92d` |
| Versión anterior limpia | `3de6cd4b89e55f31115be9c3ff55536c421c91b6:postcss.config.mjs` |
| SHA-256 del archivo restaurado, UTF-8/LF | `dfac7ac2d86d326a0e5adb024e7943c181393ed17a5fcb8f0315b24c7da6ddde` |
| Riesgo | Crítico: ejecución arbitraria de código descargado con los permisos del proceso de build |

El cargador importa HTTP, HTTPS, zlib y `child_process`; consulta servicios RPC de Ethereum y un indexador, obtiene direcciones IP a partir de datos de transacciones, descarga una carga por HTTP, la decodifica con XOR/base64 y la ejecuta mediante `eval` y un proceso Node separado con `-e`. No es parte de Tailwind, PostCSS ni UltraTecno.

Indicadores estáticos: `run_loader`, `x-payload-b64`, `A8-5167`, `eth_getBlockByNumber`, rutas `/0x/cls` y `/0x/ls`. Los servicios RPC consultados son servicios públicos; su aparición en este cargador no demuestra que sus operadores participen en el incidente. No se resolvieron las IP dinámicas ni se descargaron las cargas.

Los metadatos Git indican dónde apareció el código; no prueban quién lo introdujo ni cómo se comprometió el repositorio.

El build anterior dejó copias del cargador en `.next/build/chunks/[root-of-the-server]__0hdta66._.js` y su `.js.map`. Sus SHA-256 son, respectivamente, `30c10ca8825e5ff28be4300094b7f4f063368cc6b60d94884a41b834d175fcd3` y `d16e4c5e2a8c1b905abc4dc882338a4c70eb4284315b9846f5ce227dcc6c3291`. Se conservaron copias exactas como `.txt` fuera del producto antes de la limpieza. Esto prueba que el código quedó incorporado al artefacto; no demuestra descarga o ejecución de una segunda etapa.

## Revisión de otros archivos y coincidencias

- `package.json`: solo scripts `dev`, `build`, `start` y `lint`. Ningún `preinstall`, `install`, `postinstall`, `prepare` ni cadena de shell añadida. Se revisaron también sus versiones históricas.
- `package-lock.json`: 504 entradas de paquetes, incluida la raíz; las 503 URL `resolved` usan `registry.npmjs.org` y tienen integridad declarada. Esto no sustituye comprobar los paquetes descargados. Solo `sharp` y `unrs-resolver` están marcados con `hasInstallScript`.
- Se leyeron los instaladores de esos dos paquetes y el auxiliar `napi-postinstall`: comprobaciones de bibliotecas/binarios y posible descarga de paquetes nativos desde el registro npm. Sus llamadas a procesos y red tienen ese propósito visible; no se identificaron los indicadores del cargador. La futura reinstalación comenzará con scripts de instalación deshabilitados.
- El barrido `rg --no-ignore --hidden` de indicadores del cargador sobre archivos JS/MJS/CJS/JSON/mapas/HTML/TS/texto/logs/PS1/BAT/CMD en `node_modules` y `.next` terminó con código 0 (coincidencias encontradas): únicamente los dos artefactos de `.next` descritos arriba. No reportó coincidencias en dependencias instaladas ni errores de lectura.
- `next.config.ts`, `eslint.config.mjs`, `package.json` y `package-lock.json` no cambiaron en `e4c2880` respecto a su padre. Las configuraciones examinadas son convencionales. No se encontraron otros archivos `next.config.*` o `postcss.config.*` de la aplicación.
- No hay scripts PowerShell, BAT, CMD o SH versionados en ninguno de los 10 commits. No hay `.npmrc`, `.pnp.cjs`, `.gitmodules` ni `.gitattributes` locales. Los hooks Git presentes son ejemplos `.sample`; no hay `core.hooksPath` ni `core.fsmonitor` configurados para el repositorio. El commit de limpieza se realizará con hooks deshabilitados para esa operación.
- Se examinó el conjunto completo de cambios de `e4c2880`: 14 archivos modificados y una fotografía añadida (`public/images/localul.jpeg`, cabecera JPEG/JFIF). El único cargador confirmado está en PostCSS.
- `dist/` es un bundle antiguo de Sanity Studio incorporado en `cb6c0dfc6c2c2a1a89fb48aea2ea371fc4a4b66c`, anterior al incidente. Incluye `Function('return this')` para obtener el objeto global, expresiones regulares `.exec`, codecs base64/Unicode y comunicaciones de Sanity, vídeo y telemetría. Se revisaron las coincidencias y sus contextos; no se identificó una cadena de descarga/ejecución como la de PostCSS. No hay referencias de carga de este bundle desde la aplicación Next actual. Se conserva como material histórico versionado; no se ejecutó ni se eliminó como si fuera un build nuevo.
- En el código fuente público, las URL observadas corresponden a imágenes, mapas, WhatsApp, YouTube o documentación. Los clientes Supabase/Cloudinary usan su configuración habitual. No se identificó exfiltración añadida en las rutas API revisadas.
- El upload original carecía de autenticación y restricciones adecuadas: vulnerabilidad independiente, no evidencia de otro cargador. Su sustitución y las API nuevas son trabajo local de modernización sin pruebas completas, fuera del commit exclusivo de retirada del malware.
- `lib/server-data.ts` nuevo usa base64url para una cookie demo firmada con HMAC. `tests/browser-cdp.mjs` nuevo usa `child_process` para Chrome y `taskkill`, CDP de localhost y base64 para capturas. Son código de la modernización local, no archivos del commit contaminado. Se leyeron, pero no se ejecutaron durante esta auditoría.

## Corrección

Se eliminó el cargador completo junto con `createRequire` y el `require` que utilizaba. El archivo se restauró byte por byte desde el padre limpio, previa comprobación contra el contenido esperado:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Solo declara el plugin `@tailwindcss/postcss` y exporta su configuración. No importa red, procesos ni funciones de ejecución dinámica.

## Evidencia preservada

El commit contaminado y sus antecesores permanecen en Git; no se reescribió historial. Fuera del producto, en `G:\Orquestacion\project-state\ultratecno\security\`, se conservan:

- `pre-security-history.bundle`: historial completo anterior, verificado mediante `git bundle verify` (código 0). Contiene el código contaminado como objeto Git: no restaurarlo ni ejecutarlo.
- `static-audit.json`: inventario, hashes, patrones, líneas y dominios de versiones históricas y archivos actuales. Las coincidencias son pistas clasificadas en este informe, no veredictos automáticos.
- `artifacts-and-install-audit.json`: inventario de 520 archivos de `.next`, hashes de los dos artefactos contaminados y revisión histórica de scripts de instalación. El barrido Python inicial de todos los binarios instalados se interrumpió por lentitud de lectura; se sustituyó por búsqueda textual con `rg`, sin atribuir éxito al intento interrumpido. No se certifica el contenido de binarios nativos.
- `compiled-loader.js.txt` y `compiled-loader.js.map.txt`: copias de los dos artefactos contaminados como texto inerte. No ejecutarlos ni restaurarlos a una ruta del build.
- `security-code-diff.patch.txt`: diff íntegro de la retirada, como texto inerte; contiene el código eliminado para revisión, no para ejecución.
- Los registros de limpieza y Git final documentan los artefactos retirados y el commit exclusivo de seguridad.

No se copian credenciales, archivos `.env` reales ni cargas remotas a esta documentación.

## Preparación de reinstalación

Tras completar el inventario se retiran `.next`, `node_modules`, `tsconfig.tsbuildinfo` y `next-env.d.ts`, todos regenerables. Se conservan fuentes, lockfile, fotografías, cambios locales de modernización e historial `dist/`. La retirada se registra fuera del producto y se comprueba por ausencia de las rutas. No se reutilizará la caché npm anterior: la futura instalación utilizará una carpeta de caché nueva y scripts deshabilitados (`npm ci --ignore-scripts --cache <carpeta-nueva>`). **Ese comando no se ha ejecutado en esta auditoría.** Antes de habilitar instaladores nativos se revisarán los paquetes que realmente lo requieran.

En la sesión anterior se ejecutaron instalación y build antes de detectar el cargador; después se detuvo el servidor. La consulta de procesos realizada entonces no mostró procesos Node del proyecto ni marcadores del cargador activos. Esa observación puntual no demuestra que no hubiera ejecución previa. Es recomendable revisar el equipo con herramientas antimalware y, desde un entorno de confianza, evaluar la rotación de credenciales que pudieran haber estado accesibles. No añadir credenciales reales de Supabase todavía.

El siguiente paso es revisar este commit local y el resultado de la auditoría. No se ha hecho push ni se ha reanudado el desarrollo o la ejecución de la aplicación.
