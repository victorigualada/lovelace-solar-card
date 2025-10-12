import type { Hass } from '../types/ha';
import type { SolarCardConfig } from '../types/solar-card-config';

export function buildCandidateLists(
  hass?: Hass,
  entities?: string[],
  entitiesFallback?: string[],
): { power: string[]; fallback: string[] } {
  const power: string[] = [];
  const fallback: string[] = [];
  const seen = new Set<string>();
  const push = (collection: string[], entityId: string) => {
    if (!entityId || seen.has(entityId)) return;
    collection.push(entityId);
    seen.add(entityId);
  };
  const consider = (entityId: string) => {
    if (!entityId) return;
    const state = hass?.states?.[entityId];
    const target = state?.attributes?.device_class === 'power' ? power : fallback;
    push(target, entityId);
  };
  for (const list of [entities, entitiesFallback]) {
    if (!Array.isArray(list)) continue;
    for (const entityId of list) consider(entityId);
  }
  if (hass) {
    const states = Object.values(hass.states || {});
    for (const state of states) {
      const entityId = (state as any).entity_id as string;
      const isSensor = entityId.startsWith('sensor.');
      if (!isSensor) continue;
      const target = (state as any).attributes?.device_class === 'power' ? power : fallback;
      push(target, entityId);
    }
  }
  return { power, fallback };
}

export function getStubConfig(hass?: Hass, entities?: string[], entitiesFallback?: string[]) {
  const { power, fallback } = buildCandidateLists(hass, entities, entitiesFallback);
  const defaultProduction = power[0] || fallback[0] || 'sensor.solar_card_stub_production';
  const defaultConsumption = power[1] || power[0] || fallback[1] || fallback[0] || 'sensor.solar_card_stub_consumption';
  return {
    type: 'custom:solar-card',
    production_entity: defaultProduction,
    current_consumption_entity: defaultConsumption,
    image_url: '',
    grid_feed_entity: '',
    grid_feed_charging_entity: '',
    show_energy_flow: false,
    show_top_devices: false,
    top_devices_max: 4,
    device_badge_intensity: true,
    excluded_device_ids: [],
    show_solar_forecast: false,
    weather_entity: '',
    solar_forecast_today_entity: '',
    trend_graph_entities: [],
    total_yield_entity: '',
    total_grid_consumption_entity: '',
  } as SolarCardConfig;
}

export function normalizeConfig(config: SolarCardConfig): SolarCardConfig {
  const merged: Record<string, any> = { ...config };
  const legacyProduction = (config as Record<string, any>)?.yield_today_entity ?? '';

  merged.production_entity = config.production_entity ?? legacyProduction ?? '';
  merged.current_consumption_entity = config.current_consumption_entity ?? '';
  merged.image_url = config.image_url ?? '';
  merged.grid_feed_entity = config.grid_feed_entity ?? '';
  merged.grid_feed_charging_entity = config.grid_feed_charging_entity ?? '';
  merged.show_energy_flow = config.show_energy_flow ?? false;
  merged.show_top_devices = config.show_top_devices ?? false;
  merged.top_devices_max = Math.min(Math.max(parseInt(String(config.top_devices_max ?? 4), 10) || 4, 1), 8);
  merged.device_badge_intensity = config.device_badge_intensity ?? true;
  const excluded = (config as any).excluded_device_ids as any;
  if (Array.isArray(excluded)) {
    merged.excluded_device_ids = excluded.filter((x) => typeof x === 'string' && x);
  } else if (typeof excluded === 'string' && excluded) {
    merged.excluded_device_ids = [excluded];
  } else {
    merged.excluded_device_ids = [];
  }
  merged.show_solar_forecast = config.show_solar_forecast ?? false;
  merged.weather_entity = config.weather_entity ?? '';
  merged.solar_forecast_today_entity = config.solar_forecast_today_entity ?? '';
  merged.trend_graph_entities = Array.isArray((config as any).trend_graph_entities)
    ? ((config as any).trend_graph_entities as string[])
    : [];
  merged.total_yield_entity = config.total_yield_entity ?? '';
  merged.total_grid_consumption_entity = config.total_grid_consumption_entity ?? '';

  if (!merged.production_entity || !merged.current_consumption_entity) {
    throw new Error('Solar Card: production_entity and current_consumption_entity are required.');
  }
  return merged as SolarCardConfig;
}
