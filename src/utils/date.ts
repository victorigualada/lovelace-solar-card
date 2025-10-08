import type { Hass } from '../types/ha';

export function formatTodayDate(hass: Hass | null): string {
  try {
    const d = new Date();
    const day = d.toLocaleDateString(hass?.locale?.language || undefined, { weekday: 'short' });
    return `${day} ${d.getDate()}/${d.getMonth() + 1}`;
  } catch (_e) {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
}

