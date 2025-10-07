import type { Hass } from '../types/ha';
import type { SolarCardConfig } from '../types/solar-card-config';

export function normalizeConfig(config: SolarCardConfig): SolarCardConfig {
  const normalized: Record<string, any> = { ...config };
  const legacyProduction = (config as Record<string, any>)?.yield_today_entity ?? '';
  normalized.type = config.type ?? 'custom:solar-card';
  normalized.production_entity = config.production_entity ?? legacyProduction ?? '';
  normalized.current_consumption_entity = config.current_consumption_entity ?? '';
  normalized.image_url = config.image_url ?? '';
  normalized.show_energy_flow = config.show_energy_flow ?? false;
  normalized.show_top_devices = config.show_top_devices ?? false;
  normalized.top_devices_max = Math.min(Math.max(parseInt(String(config.top_devices_max ?? 4), 10) || 4, 1), 8);
  normalized.show_solar_forecast = config.show_solar_forecast ?? false;
  normalized.weather_entity = config.weather_entity ?? '';
  normalized.solar_forecast_today_entity = config.solar_forecast_today_entity ?? '';
  normalized.trend_graph_entities = Array.isArray(config.trend_graph_entities)
    ? config.trend_graph_entities
    : [];
  normalized.total_yield_entity = config.total_yield_entity ?? '';
  normalized.total_grid_consumption_entity = config.total_grid_consumption_entity ?? '';
  delete normalized.yield_today_entity;
  delete normalized.grid_consumption_today_entity;
  delete normalized.battery_percentage_entity;
  delete normalized.inverter_state_entity;
  delete normalized.battery_capacity_entity;
  delete normalized.inverter_mode_entity;

  if (!normalized.production_entity || !normalized.current_consumption_entity) {
    throw new Error('Solar Card: production_entity and current_consumption_entity are required.');
  }

  return normalized as SolarCardConfig;
}

function buildCandidateLists(
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
      const entityId = state.entity_id;
      const isSensor = entityId.startsWith('sensor.');
      if (!isSensor) continue;
      const target = state.attributes?.device_class === 'power' ? power : fallback;
      push(target, entityId);
    }
  }

  return { power, fallback };
}

export function stubConfig(
  hass?: Hass,
  entities?: string[],
  entitiesFallback?: string[],
): SolarCardConfig {
  const { power, fallback } = buildCandidateLists(hass, entities, entitiesFallback);
  const defaultProduction = power[0] || fallback[0] || 'sensor.solar_card_stub_production';
  const defaultConsumption = power[1] || power[0] || fallback[1] || fallback[0] || 'sensor.solar_card_stub_consumption';

  return {
    type: 'custom:solar-card',
    production_entity: defaultProduction,
    current_consumption_entity: defaultConsumption,
    image_url: '',
    show_energy_flow: false,
    show_top_devices: false,
    top_devices_max: 4,
    show_solar_forecast: false,
    weather_entity: '',
    solar_forecast_today_entity: '',
    trend_graph_entities: [],
    total_yield_entity: '',
    total_grid_consumption_entity: '',
  } satisfies SolarCardConfig;
}
