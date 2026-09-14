import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!base || !key) throw new Error('Supabase public configuration is incomplete');
const headers = { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact', Range: '0-0' };
const result = { timestamp: new Date().toISOString(), auth: {}, tables: {}, error: null };

try {
  const settingsResponse = await fetch(`${base.replace(/\/$/, '')}/auth/v1/settings`, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
  const settings = await settingsResponse.json();
  result.auth = { status: settingsResponse.status, email: Boolean(settings.external?.email), signupDisabled: Boolean(settings.disable_signup), autoConfirm: Boolean(settings.mailer_autoconfirm) };
  for (const table of ['products', 'courses', 'categories', 'services', 'tips']) {
    const response = await fetch(`${base.replace(/\/$/, '')}/rest/v1/${table}?select=*&limit=1`, { headers, signal: AbortSignal.timeout(15000) });
    const body = await response.json();
    if (!response.ok) result.tables[table] = { status: response.status, code: String(body.code || 'unknown') };
    else result.tables[table] = { status: response.status, visibleCount: response.headers.get('content-range')?.split('/')[1] || 'unknown', columns: body[0] ? Object.keys(body[0]) : [] };
  }
} catch (error) {
  result.error = error instanceof Error ? error.name : 'UnknownError';
  process.exitCode = 1;
}

const output = resolve(process.env.QA_OUT || '../../project-state/ultratecno/qa');
mkdirSync(output, { recursive: true });
writeFileSync(join(output, 'supabase-read-results.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
