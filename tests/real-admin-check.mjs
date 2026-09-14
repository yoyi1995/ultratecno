import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

const base = process.env.QA_URL || 'http://127.0.0.1:3200';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const email = process.env.QA_ADMIN_EMAIL;
const password = process.env.QA_ADMIN_PASSWORD;
const output = resolve(process.env.QA_OUT || '../../project-state/ultratecno/qa');
const collections = ['products', 'categories', 'services', 'courses', 'tips'];
const stamp = Date.now();
const marker = `QA_TEST_${stamp}`;
const slug = `qa-test-${stamp}`;
const checks = [];
const cleanup = [];
const created = new Map();
const baseline = new Map();
let cookie = '';
let adminToken = '';
let uploadedUrl = '';
let cloudinaryPublicId = '';
let failure = null;

if (!supabaseUrl || !supabaseKey || !email || !password) throw new Error('Real QA configuration is incomplete');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function record(name) {
  checks.push({ name, passed: true });
}

async function app(path, options = {}, authenticated = true) {
  const headers = new Headers(options.headers);
  headers.set('Origin', base);
  if (authenticated && cookie) headers.set('Cookie', cookie);
  return fetch(new URL(path, base), { ...options, headers, signal: AbortSignal.timeout(20000) });
}

async function json(response) {
  const body = await response.json();
  return { response, body };
}

async function adminRows(collection) {
  const { response, body } = await json(await app(`/api/content/${collection}?admin=1`));
  assert.equal(response.status, 200, `${collection} admin read failed`);
  assert.ok(Array.isArray(body.data));
  return body.data;
}

async function write(collection, method, body, expectedStatus = method === 'POST' ? 201 : 200) {
  const result = await json(await app(`/api/content/${collection}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
  assert.equal(result.response.status, expectedStatus, `${collection} ${method} failed`);
  return result.body.data;
}

function cloudinaryId(url) {
  const afterUpload = new URL(url).pathname.split('/upload/')[1];
  if (!afterUpload) return '';
  const parts = afterUpload.split('/');
  if (/^v\d+$/.test(parts[0])) parts.shift();
  return parts.join('/').replace(/\.[a-z0-9]+$/i, '');
}

async function direct(path, { method = 'GET', token = supabaseKey, body } = {}) {
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
}

async function cleanupRow(collection, id) {
  try {
    const response = await app(`/api/content/${collection}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      cleanup.push({ target: collection, removed: true, via: 'application' });
      return;
    }
  } catch {}
  if (!adminToken) throw new Error(`Cannot clean ${collection}`);
  const response = await direct(`${collection}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', token: adminToken });
  if (!response.ok) throw new Error(`Direct cleanup failed for ${collection}`);
  cleanup.push({ target: collection, removed: true, via: 'rls-admin' });
}

try {
  const wrong = await app('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: `${password}-incorrect` }),
  }, false);
  assert.equal(wrong.status, 401);
  record('Auth rejects an incorrect password');

  const login = await app('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, false);
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie')?.split(';')[0] || '';
  assert.ok(cookie.startsWith('ultratecno_session='));
  record('Application Auth accepts the existing administrator');

  const session = await json(await app('/api/auth'));
  assert.equal(session.response.status, 200);
  assert.ok(session.body.user);
  assert.equal(session.body.mode, 'supabase');
  record('Authenticated session is Supabase-backed');

  const tokenResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    signal: AbortSignal.timeout(20000),
  });
  const tokenBody = await tokenResponse.json();
  assert.equal(tokenResponse.status, 200);
  assert.equal(tokenBody.user?.app_metadata?.role, 'admin');
  adminToken = tokenBody.access_token;
  record('Supabase JWT carries the admin role');

  for (const collection of collections) {
    const rows = await adminRows(collection);
    baseline.set(collection, new Set(rows.map(row => String(row.id))));
  }
  record('Existing content inventory captured by ID');

  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
  const form = new FormData();
  form.append('file', new File([png], `${marker}.png`, { type: 'image/png' }));
  const upload = await json(await app('/api/upload', { method: 'POST', body: form }));
  assert.equal(upload.response.status, 200);
  uploadedUrl = upload.body.url;
  assert.equal(new URL(uploadedUrl).protocol, 'https:');
  cloudinaryPublicId = cloudinaryId(uploadedUrl);
  assert.ok(cloudinaryPublicId.startsWith('ultratecno/'));
  assert.ok((await fetch(uploadedUrl, { signal: AbortSignal.timeout(20000) })).ok);
  record('Authenticated /admin upload reaches Cloudinary');

  const payloads = {
    categories: { name: `${marker}_Category`, slug, sort_order: 999999, image_url: uploadedUrl, active: true },
    products: { name: `${marker}_Product`, description: 'Registro temporal QA', price: 1.23, category: slug, brand: 'QA_TEST', image_url: uploadedUrl, images: [uploadedUrl], specifications: { QA: 'TEST' }, in_stock: true, featured: false, active: true },
    services: { title: `${marker}_Service`, category: 'QA_TEST', image_url: uploadedUrl, description: 'Registro temporal QA', includes: ['QA_TEST'], problems: ['QA_TEST'], recommendations: ['QA_TEST'], featured: false, active: true },
    courses: { title: `${marker}_Course`, image_url: uploadedUrl, description: 'Registro temporal QA', syllabus: ['QA_TEST'], level: 'QA_TEST', modality: 'QA_TEST', duration: '1 hora', start_date: null, schedule: 'QA_TEST', seats: 1, status: 'upcoming', featured: false, active: true },
    tips: { title: `${marker}_Tip`, description: 'Registro temporal QA', content: 'Contenido temporal QA_TEST', kind: 'article', url: '', image_url: uploadedUrl, category: 'QA_TEST', active: true },
  };

  for (const collection of ['categories', 'products', 'services', 'courses', 'tips']) {
    const row = await write(collection, 'POST', payloads[collection]);
    assert.ok(row?.id);
    created.set(collection, { id: String(row.id), payload: payloads[collection] });
    assert.ok((await adminRows(collection)).some(item => String(item.id) === String(row.id)));
    const publicResult = await json(await app(`/api/content/${collection}`, {}, false));
    assert.equal(publicResult.response.status, 200);
    assert.ok(publicResult.body.data.some(item => String(item.id) === String(row.id)));
    record(`${collection}: real create and public read`);
  }

  const category = created.get('categories');
  const blockedRename = await app('/api/content/categories', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...category.payload, id: category.id, slug: `${slug}-renamed` }),
  });
  assert.equal(blockedRename.status, 409);
  const blockedDelete = await app('/api/content/categories', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: category.id }),
  });
  assert.equal(blockedDelete.status, 409);
  record('Category referenced by a product cannot be renamed or deleted');

  for (const collection of ['products', 'services', 'courses', 'tips', 'categories']) {
    const entry = created.get(collection);
    const updated = { ...entry.payload, id: entry.id, active: false };
    if ('description' in updated) updated.description = `${updated.description} updated`;
    if ('sort_order' in updated) updated.sort_order = 999998;
    const row = await write(collection, 'PUT', updated);
    assert.equal(row.active, false);
    entry.payload = updated;
    const publicResult = await json(await app(`/api/content/${collection}`, {}, false));
    assert.ok(!publicResult.body.data.some(item => String(item.id) === entry.id));
    const anonymous = await direct(`${collection}?id=eq.${encodeURIComponent(entry.id)}&select=id,active`);
    assert.equal(anonymous.status, 200);
    assert.deepEqual(await anonymous.json(), []);
    const administrative = await direct(`${collection}?id=eq.${encodeURIComponent(entry.id)}&select=id,active`, { token: adminToken });
    assert.equal(administrative.status, 200);
    assert.equal((await administrative.json()).length, 1);
    record(`${collection}: real update and inactive-row RLS`);
  }

  const deniedPayload = { ...payloads.tips, title: `${marker}_AnonDenied` };
  const denied = await direct('tips', { method: 'POST', body: deniedPayload });
  assert.ok([401, 403].includes(denied.status));
  const deniedLookup = await direct(`tips?title=eq.${encodeURIComponent(deniedPayload.title)}&select=id`, { token: adminToken });
  assert.equal(deniedLookup.status, 200);
  assert.deepEqual(await deniedLookup.json(), []);
  record('Direct anonymous mutation is denied by Supabase RLS/grants');
} catch (error) {
  failure = error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown failure';
  process.exitCode = 1;
} finally {
  for (const collection of ['products', 'services', 'courses', 'tips', 'categories']) {
    const entry = created.get(collection);
    if (!entry) continue;
    try {
      await cleanupRow(collection, entry.id);
    } catch (error) {
      cleanup.push({ target: collection, removed: false, error: error instanceof Error ? error.message : 'cleanup failure' });
      process.exitCode = 1;
    }
  }

  if (cloudinaryPublicId) {
    try {
      const removed = await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: 'image', invalidate: true });
      const ok = ['ok', 'not found'].includes(removed.result);
      cleanup.push({ target: 'cloudinary', removed: ok });
      if (!ok) process.exitCode = 1;
    } catch (error) {
      cleanup.push({ target: 'cloudinary', removed: false, error: error instanceof Error ? error.name : 'cleanup failure' });
      process.exitCode = 1;
    }
  }

  if (cookie) {
    try {
      const logout = await app('/api/auth', { method: 'DELETE' });
      cleanup.push({ target: 'session', removed: logout.ok });
      if (!logout.ok) process.exitCode = 1;
    } catch {
      cleanup.push({ target: 'session', removed: false });
      process.exitCode = 1;
    }
  }

  if (cookie && baseline.size === collections.length) {
    try {
      for (const collection of collections) {
        const rows = await adminRows(collection);
        const finalIds = new Set(rows.map(row => String(row.id)));
        assert.deepEqual(finalIds, baseline.get(collection), `${collection} inventory changed`);
      }
      cleanup.push({ target: 'existing-content', preserved: true });
    } catch (error) {
      cleanup.push({ target: 'existing-content', preserved: false, error: error instanceof Error ? error.message : 'inventory failure' });
      process.exitCode = 1;
    }
  }

  mkdirSync(output, { recursive: true });
  const report = {
    timestamp: new Date().toISOString(),
    base,
    markerPrefix: 'QA_TEST_',
    checks,
    cleanup,
    failure,
  };
  writeFileSync(join(output, 'real-admin-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: checks.length, cleanup, failure }, null, 2));
}
