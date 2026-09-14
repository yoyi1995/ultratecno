// Live HTTP checks against the running application. Does not mutate content.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const base = process.env.QA_URL || 'http://localhost:3000';
const output = resolve(process.env.QA_OUT || '../../project-state/ultratecno/qa');
mkdirSync(output, { recursive: true });
const checks = [];
async function request(path, options) {
  return fetch(new URL(path, base), { ...options, signal: AbortSignal.timeout(15000) });
}
async function check(name, work) {
  await work(); checks.push({ name, passed: true });
}
let failure;
try {
  for (const collection of ['products', 'categories', 'services', 'courses', 'tips']) {
    await check(`${collection}: public active content`, async () => {
      const response = await request(`/api/content/${collection}`);
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.ok(Array.isArray(body.data));
      assert.ok(body.data.every(row => row.active));
    });
    await check(`${collection}: private read denied`, async () => {
      assert.equal((await request(`/api/content/${collection}?admin=1`)).status, 401);
    });
    for (const method of ['POST', 'PUT', 'DELETE']) {
      await check(`${collection}: anonymous ${method} denied`, async () => {
        const response = await request(`/api/content/${collection}`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'qa-nonexistent-record' }) });
        assert.equal(response.status, 401);
      });
    }
  }
  await check('Anonymous session has no administrator', async () => {
    const response = await request('/api/auth');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).user, null);
  });
  await check('Cross-origin mutation denied', async () => {
    const response = await request('/api/content/products', { method: 'POST', headers: { Origin: 'https://qa-invalid.example', 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(response.status, 403);
  });
  await check('Anonymous upload denied', async () => {
    const response = await request('/api/upload', { method: 'POST' });
    assert.equal(response.status, 401);
  });
} catch (error) { failure = String(error); process.exitCode = 1; }
writeFileSync(join(output, 'permissions-results.json'), JSON.stringify({ timestamp: new Date().toISOString(), base, checks, failure }, null, 2));
console.log(JSON.stringify({ passed: checks.length, failure }, null, 2));
