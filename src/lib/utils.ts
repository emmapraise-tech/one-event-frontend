import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseNumber(val: string): number {
  const parsed = parseFloat(val.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export function getImageUrl(url?: string): string {
  if (!url) return '/images/venue-1.jpg';
  if (url.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
    const baseUrl = apiUrl.replace(/\/v1\/?$/, '');
    return `${baseUrl}${url}`;
  }
  return url;
}

export function isLocalUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1') || url.startsWith('/');
}
