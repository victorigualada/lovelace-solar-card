import type { Hass } from '../types/ha';
import type { SolarCardConfig } from '../types';
import { entityDisplay } from '../utils/entity';

// Overview no longer computes grid feed; that logic lives with devices row.
export function computeOverview(hass: Hass | null, cfg: SolarCardConfig) {
  return {
    production: entityDisplay(hass, cfg.production_entity),
    consumption: entityDisplay(hass, cfg.current_consumption_entity),
    image_url: cfg.image_url || '',
  };
}
