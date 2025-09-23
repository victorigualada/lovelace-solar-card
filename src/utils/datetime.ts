import type { Hass } from '../types/ha';

export function formatTodayDate(hass: Hass | null): string {
  try {
    const d = new Date();
    const locale = hass?.locale?.language || undefined;
    const day = d.toLocaleDateString(locale, { weekday: 'short' });
    return `${day} ${d.getDate()}/${d.getMonth() + 1}`;
  } catch (_e) {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
}
