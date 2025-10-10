import type { Hass } from '../types/ha';
import type { SolarCardConfig } from '../types/solar-card-config';

export type GridFeedData = {
  entity: string;
  visible: boolean;
  direction: 'import' | 'export';
  rawWatts: number | null;
  charging: boolean;
};

export function stateAsBoolean(state: unknown): boolean {
  if (typeof state === 'boolean') return state;
  const str = String(state ?? '')
    .trim()
    .toLowerCase();
  if (str === 'on' || str === 'true' || str === '1' || str === 'open' || str === 'active' || str === 'charging')
    return true;
  if (str === 'off' || str === 'false' || str === '0' || str === 'closed' || str === 'inactive') return false;
  const num = Number(str);
  return Number.isNaN(num) ? false : num !== 0;
}

export function computeGridFeed(hass: Hass | null, cfg: SolarCardConfig): GridFeedData {
  const entity = cfg.grid_feed_entity || '';
  const st = entity ? hass?.states?.[entity] : undefined;
  const raw = st ? Number(st.state) : NaN;
  const available =
    !!entity &&
    !!st &&
    st.state !== 'unavailable' &&
    st.state !== 'unknown' &&
    st.state !== 'none' &&
    Number.isFinite(raw);
  const visible = available;
  const direction: 'import' | 'export' = available && raw < 0 ? 'export' : 'import';
  let charging = false;
  if (visible && cfg.grid_feed_charging_entity) {
    const ch = hass?.states?.[cfg.grid_feed_charging_entity];
    if (ch) charging = stateAsBoolean(ch.state);
  }
  return { entity, visible, direction, rawWatts: available ? raw : null, charging };
}
