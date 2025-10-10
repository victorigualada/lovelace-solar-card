import type { Hass } from '../types/ha';
import { formatNumberLocale } from './format';

interface FormatPowerOptions {
  digitsKW?: number;
  digitsW?: number;
}

export function formatPowerWatts(
  watts: number,
  hass: Hass | null | undefined,
  options: FormatPowerOptions = {},
): string {
  if (!Number.isFinite(watts)) return '';
  const abs = Math.abs(watts);
  const digitsKW = Number.isFinite(options.digitsKW) ? Math.max(0, Number(options.digitsKW)) : 1;
  const digitsW = Number.isFinite(options.digitsW) ? Math.max(0, Number(options.digitsW)) : 0;
  if (abs >= 1000) {
    const value = watts / 1000;
    const formatted = formatNumberLocale(value, hass, {
      minimumFractionDigits: digitsKW,
      maximumFractionDigits: digitsKW,
    });
      return `${formatted} kW`;
  }
  const formatted = formatNumberLocale(watts, hass, {
    minimumFractionDigits: digitsW,
    maximumFractionDigits: digitsW,
  });
  return `${formatted} W`;
}

export function powerWattsFromState(hass: Hass | null, entityId?: string | null): number | null {
  if (!entityId) return null;
  const st = hass?.states?.[entityId];
  if (!st) return null;
  const raw = Number(st.state);
  if (!Number.isFinite(raw)) return null;
  const unit = String(st.attributes?.unit_of_measurement || '').toLowerCase();
  let watts = raw;
  if (unit.includes('mw')) {
    watts = raw * 1_000_000;
  } else if (unit.includes('kw')) {
    watts = raw * 1000;
  } else if (unit.includes('w')) {
    watts = raw;
  }
  return Number.isFinite(watts) ? watts : null;
}
