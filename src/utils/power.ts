import type { Hass } from '../types/ha';

export function powerWattsFromState(hass: Hass | null, entityId: string): number | null {
  const st = hass?.states?.[entityId];
  if (!st) return null;
  const raw = Number(st.state);
  if (!isFinite(raw)) return null;
  const unit = (st.attributes?.unit_of_measurement || '').toLowerCase();
  let watts = raw;
  if (unit.includes('kw')) watts = raw * 1000;
  if (!isFinite(watts)) return null;
  return watts;
}

