import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

const base = process.env.QA_URL || 'http://127.0.0.1:3400';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const email = process.env.QA_ADMIN_EMAIL;
const password = process.env.QA_ADMIN_PASSWORD;
const marker = `QA_TEST_SERVICE_${Date.now()}`;
const output = resolve(process.env.QA_OUT || '../../project-state/ultratecno/qa');
const checks = [];
const cleanup = [];
const baseline = new Set();
const created = [];
let cookie = '';
let cloudinaryPublicId = '';
let failure = null;

if (!supabaseUrl || !supabaseKey || !email || !password) throw new Error('Real service QA configuration is incomplete');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function pass(name) { checks.push({ name, passed: true }); }

async function request(path, options = {}, authenticated = true) {
  const headers = new Headers(options.headers);
  headers.set('Origin', base);
  if (authenticated && cookie) headers.set('Cookie', cookie);
  return fetch(new URL(path, base), { ...options, headers, signal: AbortSignal.timeout(20000) });
}

async function body(response) { return { response, data: await response.json() }; }

async function rows(admin = false) {
  const result = await body(await request(`/api/content/services${admin ? '?admin=1' : ''}`, {}, admin));
  assert.equal(result.response.status, 200);
  assert.ok(Array.isArray(result.data.data));
  return result.data.data;
}

async function write(method, payload, expected = method === 'POST' ? 201 : 200) {
  const result = await body(await request('/api/content/services', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }));
  assert.equal(result.response.status, expected, `${method} service failed`);
  return result.data.data;
}

async function direct(path, options = {}) {
  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: options.payload ? JSON.stringify(options.payload) : undefined,
    signal: AbortSignal.timeout(20000),
  });
}

function publicId(url) {
  const path = new URL(url).pathname.split('/upload/')[1];
  if (!path) return '';
  const parts = path.split('/');
  if (/^v\d+$/.test(parts[0])) parts.shift();
  return parts.join('/').replace(/\.[a-z0-9]+$/i, '');
}

try {
  const login = await request('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, false);
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie')?.split(';')[0] || '';
  assert.ok(cookie.startsWith('ultratecno_session='));
  pass('Existing Supabase administrator login');

  for (const row of await rows(true)) baseline.add(String(row.id));

  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
  const form = new FormData();
  form.append('file', new File([png], `${marker}.png`, { type: 'image/png' }));
  const upload = await body(await request('/api/upload', { method: 'POST', body: form }));
  assert.equal(upload.response.status, 200);
  assert.equal(new URL(upload.data.url).hostname, 'res.cloudinary.com');
  cloudinaryPublicId = publicId(upload.data.url);
  assert.ok(cloudinaryPublicId.startsWith('ultratecno/'));
  pass('Authenticated admin upload to existing Cloudinary');

  const fixtures = ['mantenimiento', 'reparacion'].map(category => ({
    title: `${marker}_${category}`,
    category,
    image_url: upload.data.url,
    description: 'Registro temporal para validar catálogos separados.',
    includes: ['QA_TEST síntoma o tarea'],
    problems: ['QA_TEST problema'],
    recommendations: ['QA_TEST recomendación'],
    featured: false,
    active: true,
  }));

  for (const fixture of fixtures) {
    const saved = await write('POST', fixture);
    assert.ok(saved.id);
    created.push({ id: String(saved.id), payload: fixture });
    assert.ok((await rows()).some(row => String(row.id) === String(saved.id)));
    pass(`${fixture.category}: admin create and public read`);
  }

  const invalid = await request('/api/content/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fixtures[0], title: `${marker}_invalid`, category: 'otro' }),
  });
  assert.equal(invalid.status, 400);
  pass('Unknown service type rejected');

  const anonymous = await direct('services', { method: 'POST', payload: { ...fixtures[1], title: `${marker}_anon` } });
  assert.ok([401, 403].includes(anonymous.status));
  pass('Anonymous Supabase write denied by RLS/grants');

  for (const item of created) {
    const saved = await write('PUT', { ...item.payload, id: item.id, active: false });
    assert.equal(saved.active, false);
    assert.ok(!(await rows()).some(row => String(row.id) === item.id));
    const hidden = await direct(`services?id=eq.${encodeURIComponent(item.id)}&select=id`);
    assert.equal(hidden.status, 200);
    assert.deepEqual(await hidden.json(), []);
    pass(`${item.payload.category}: inactive row hidden by RLS`);
  }
} catch (error) {
  failure = error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown failure';
  process.exitCode = 1;
} finally {
  for (const item of created) {
    try {
      await write('DELETE', { id: item.id });
      cleanup.push({ target: item.payload.category, removed: true });
    } catch (error) {
      cleanup.push({ target: item.payload.category, removed: false, error: error instanceof Error ? error.message : 'cleanup failure' });
      process.exitCode = 1;
    }
  }
  if (cloudinaryPublicId) {
    try {
      const removed = await cloudinary.uploader.destroy(cloudinaryPublicId, { invalidate: true, resource_type: 'image' });
      const ok = ['ok', 'not found'].includes(removed.result);
      cleanup.push({ target: 'cloudinary', removed: ok });
      if (!ok) process.exitCode = 1;
    } catch (error) {
      cleanup.push({ target: 'cloudinary', removed: false, error: error instanceof Error ? error.name : 'cleanup failure' });
      process.exitCode = 1;
    }
  }
  if (cookie) await request('/api/auth', { method: 'DELETE' }).catch(() => {});
  if (cookie) {
    try {
      const finalIds = new Set((await rows(true)).map(row => String(row.id)));
      assert.deepEqual(finalIds, baseline);
      cleanup.push({ target: 'existing-services', preserved: true });
    } catch (error) {
      cleanup.push({ target: 'existing-services', preserved: false, error: error instanceof Error ? error.message : 'inventory failure' });
      process.exitCode = 1;
    }
  }
  mkdirSync(output, { recursive: true });
  writeFileSync(join(output, 'service-real-results.json'), JSON.stringify({ timestamp: new Date().toISOString(), checks, cleanup, failure }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, cleanup, failure }, null, 2));
}
