import { v2 as cloudinary } from 'cloudinary';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const output = resolve(process.env.QA_OUT || '../../project-state/ultratecno/qa');
const publicId = `ultratecno/qa/QA_TEST_${Date.now()}`;
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const result = { timestamp: new Date().toISOString(), uploaded: false, fetched: false, host: '', cleanup: 'not-attempted', error: null };

try {
  const uploaded = await cloudinary.uploader.upload(`data:image/png;base64,${png.toString('base64')}`, { public_id: publicId, overwrite: false, resource_type: 'image' });
  result.uploaded = Boolean(uploaded.secure_url);
  const url = new URL(uploaded.secure_url);
  result.host = url.hostname;
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  result.fetched = response.ok && Number(response.headers.get('content-length') || 1) > 0;
} catch (error) {
  result.error = error instanceof Error ? error.name : 'UnknownError';
  process.exitCode = 1;
} finally {
  try {
    const removed = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    result.cleanup = removed.result;
  } catch (error) {
    result.cleanup = error instanceof Error ? error.name : 'cleanup-error';
    process.exitCode = 1;
  }
  mkdirSync(output, { recursive: true });
  writeFileSync(join(output, 'cloudinary-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}
