import type { Hass } from '../types/ha';

export function escapeHtml(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatNumberLocale(
  value: unknown,
  hass: Hass | null | undefined,
  options: Intl.NumberFormatOptions = {},
): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  const locale = hass?.locale?.language || hass?.language || navigator.language || 'en';
  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch (_e) {
    return String(num);
  }
}
