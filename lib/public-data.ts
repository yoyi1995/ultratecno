import 'server-only';
import { cache } from 'react';
import { client, configured, readDemo } from './server-data';
import type { Collection, ContentMap } from './types';

async function publicRows<K extends Collection>(collection: K): Promise<ContentMap[K][]> {
  if (!configured) {
    const database = await readDemo();
    return database[collection].filter(row => row.active);
  }
  const result = await client().from(collection).select('*').eq('active', true);
  if (result.error) throw new Error(`Unable to read public ${collection}`);
  return result.data as unknown as ContentMap[K][];
}

export async function publicInitialData<T>(read: () => Promise<T[]>): Promise<T[]> {
  try {
    return await read();
  } catch (error) {
    console.error('Unable to preload public SEO content:', error instanceof Error ? error.message : 'unknown error');
    return [];
  }
}

export const getPublicProducts = cache(() => publicRows('products'));
export const getPublicCategories = cache(() => publicRows('categories'));
export const getPublicServices = cache(() => publicRows('services'));
export const getPublicCourses = cache(() => publicRows('courses'));
export const getPublicTips = cache(() => publicRows('tips'));
