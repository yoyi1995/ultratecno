import type { Metadata } from 'next';
import type { Product } from './types';

export const SITE_URL = 'https://ultratecno.netlify.app';
export const SITE_NAME = 'UltraTecno';
export const DEFAULT_SOCIAL_IMAGE = '/images/publicidad-ultratecno.jpeg';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'producto';
}

export function productSlug(product: Pick<Product, 'id' | 'name'>) {
  return `${slugify(product.name)}-${slugify(String(product.id))}`;
}

export function seoMetadata({ title, description, path, image = DEFAULT_SOCIAL_IMAGE, type = 'website' }: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website';
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || DEFAULT_SOCIAL_IMAGE);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, locale: 'es_EC', type, images: [{ url: imageUrl, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
