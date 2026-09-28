import assert from 'node:assert/strict';

const SITE_URL='https://ultratecno.netlify.app';
const base=(process.env.QA_URL||'http://127.0.0.1:3500').replace(/\/$/,'');
const checks=[];
const pass=name=>checks.push({name,passed:true});
const get=path=>fetch(new URL(path,base),{signal:AbortSignal.timeout(20000)});
const html=async path=>{const response=await get(path);assert.equal(response.status,200,`${path} status`);return {response,text:await response.text()}};
const tag=(source,pattern)=>source.match(pattern)?.[1]||'';
const meta=(source,name)=>tag(source,new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]+)"|<meta[^>]+content="([^"]+)"[^>]+(?:name|property)="${name}"`,'i'))||source.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+(?:name|property)="${name}"`,'i'))?.[1]||'';
const canonical=source=>tag(source,/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)||tag(source,/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
const jsonScripts=source=>[...source.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>JSON.parse(match[1]));

const home=await html('/');
assert.match(home.text,/<title>UltraTecno \| Tienda tecnológica, mantenimiento y reparación<\/title>/);
assert.equal(canonical(home.text),SITE_URL);
assert.ok(meta(home.text,'description').includes('Productos y accesorios tecnológicos'));
assert.ok(meta(home.text,'description').includes('Mantenimiento y reparación'));
assert.equal(meta(home.text,'og:url'),SITE_URL);
const organization=jsonScripts(home.text).find(value=>value['@type']==='LocalBusiness');
assert.equal(organization.name,'UltraTecno');
assert.equal(organization.telephone,'+593987808181');
assert.equal(organization.address.addressLocality,'Machala');
assert.ok(!('aggregateRating' in organization));
pass('Home metadata and truthful LocalBusiness JSON-LD');

for(const [path,titlePart] of [['/tienda','Tienda de tecnología y accesorios'],['/mantenimiento','Mantenimiento preventivo de equipos'],['/reparaciones','Reparación y diagnóstico de equipos'],['/cursos','Cursos y capacitación tecnológica']]){const page=await html(path);assert.ok(tag(page.text,/<title>([^<]+)<\/title>/i).includes(titlePart));assert.equal(canonical(page.text),`${SITE_URL}${path}`);assert.equal(meta(page.text,'og:url'),`${SITE_URL}${path}`);assert.ok(meta(page.text,'og:image').startsWith('https://'));assert.ok(meta(page.text,'description').length<=160);}
pass('Independent metadata, canonical and Open Graph for commercial and service pages');

const oldStore=await fetch(new URL('/products?q=laptop',base),{redirect:'manual'});
assert.equal(oldStore.status,308);
assert.equal(new URL(oldStore.headers.get('location'),base).pathname+new URL(oldStore.headers.get('location'),base).search,'/tienda?q=laptop');
const oldCourses=await fetch(new URL('/courses',base),{redirect:'manual'});
assert.equal(oldCourses.status,308);
assert.equal(new URL(oldCourses.headers.get('location'),base).pathname,'/cursos');
pass('Legacy routes permanently redirect to Spanish canonical routes');

const robots=await (await get('/robots.txt')).text();
assert.ok(robots.includes('Allow: /'));
for(const path of ['/admin','/api/','/cart'])assert.ok(robots.includes(`Disallow: ${path}`));
assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
pass('Robots allows public pages and excludes private/non-indexable areas');

const [productPayload,categoryPayload]=await Promise.all([(await get('/api/content/products')).json(),(await get('/api/content/categories')).json()]);
const products=productPayload.data;
const categories=categoryPayload.data;
const store=await html('/tienda');
assert.match(store.text,/data-testid="product-card"/);
assert.match(store.text,/href="\/productos\//);
assert.match(home.text,/href="\/categoria\//);
const maintenance=await html('/mantenimiento');
const repairs=await html('/reparaciones');
const courses=await html('/cursos');
assert.match(maintenance.text,/data-service-kind="mantenimiento"/);
assert.match(repairs.text,/data-service-kind="reparacion"/);
assert.match(courses.text,/data-testid="course-card"/);
pass('Commercial, service and course content is present in crawlable HTML');
const sitemap=await (await get('/sitemap.xml')).text();
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
for(const path of ['/','/tienda','/mantenimiento','/reparaciones','/cursos'])assert.ok(locations.includes(`${SITE_URL}${path}`));
for(const category of categories)assert.ok(locations.includes(`${SITE_URL}/categoria/${category.slug}`));
for(const product of products)assert.ok(locations.some(url=>new URL(url).pathname.startsWith('/productos/')&&new URL(url).pathname.endsWith(`-${String(product.id).toLowerCase()}`)));
assert.ok(!locations.some(url=>/\/(admin|api|cart)(\/|$)/.test(new URL(url).pathname)));
assert.equal(locations.filter(url=>url.includes('/categoria/')).length,categories.length);
assert.equal(locations.filter(url=>url.includes('/productos/')).length,products.length);
pass('Sitemap contains only public static pages and active category/product records');

assert.ok(products.length>0);
const product=products[0];
const productPath=new URL(locations.find(url=>new URL(url).pathname.startsWith('/productos/')&&new URL(url).pathname.endsWith(`-${String(product.id).toLowerCase()}`))).pathname;
const productPage=await html(productPath);
assert.equal(canonical(productPage.text),`${SITE_URL}${productPath}`);
assert.ok(productPage.text.includes(`<h1>${product.name}</h1>`));
const productData=jsonScripts(productPage.text).find(value=>value['@type']==='Product');
assert.equal(productData.name,product.name);
assert.equal(Number(productData.offers.price),Number(product.price));
assert.equal(productData.offers.priceCurrency,'USD');
assert.equal(productData.offers.availability,product.in_stock?'https://schema.org/InStock':'https://schema.org/OutOfStock');
for(const field of ['review','aggregateRating','gtin','sku','mpn'])assert.ok(!(field in productData));
const productAlias=await fetch(new URL(`/productos/alias-${String(product.id).toLowerCase()}`,base),{redirect:'manual'});
assert.equal(productAlias.status,308);
assert.equal(new URL(productAlias.headers.get('location'),base).pathname,productPath);
pass('Product page metadata and JSON-LD use only real catalog values');

assert.ok(categories.length>0);
const category=categories[0];
const categoryPage=await html(`/categoria/${category.slug}`);
assert.equal(canonical(categoryPage.text),`${SITE_URL}/categoria/${category.slug}`);
assert.ok(categoryPage.text.includes(`<h1>${category.name}</h1>`));
pass('Public category has an indexable canonical page');

const missing=await get('/productos/no-existe-qa');
assert.equal(missing.status,404);
assert.match(await missing.text(),/name="robots" content="noindex"/i);
const admin=await html('/admin');
assert.ok(meta(admin.text,'robots').includes('noindex'));
const cart=await html('/cart');
assert.ok(meta(cart.text,'robots').includes('noindex'));
pass('404, admin and cart are noindex');

console.log(JSON.stringify({passed:checks.length,products:products.length,categories:categories.length},null,2));
