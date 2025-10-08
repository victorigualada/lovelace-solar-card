import type { Hass, HassEntity } from '../types/ha';
import type { DisplayValue } from '../types/solar-card-config';
import { formatNumberLocale } from './format';

const UNAVAILABLE_STATES = new Set(['unknown', 'unavailable', 'none']);

export function entityDisplay(hass: Hass | null, entityId?: string | null): DisplayValue {
  if (!entityId) return { value: '—', unit: '' };
  const stateObj = hass?.states?.[entityId as string] as HassEntity | undefined;
  if (!stateObj) return { value: '—', unit: '' };
  const unit = stateObj.attributes.unit_of_measurement || '';
  const state = stateObj.state;
  if (UNAVAILABLE_STATES.has(state)) return { value: '—', unit };
  const value = formatNumberLocale(state, hass, { maximumFractionDigits: 2 });
  return { value, unit };
}

