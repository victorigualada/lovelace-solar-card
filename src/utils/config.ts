import type { Hass } from '../types/ha';
import type { SolarCardConfig } from '../types/solar-card-config';

export function normalizeConfig(config: SolarCardConfig): SolarCardConfig {
  const normalized: SolarCardConfig = {
    ...config,
    type: config.type ?? 'custom:solar-card',
    production_entity: config.production_entity ?? config.yield_today_entity ?? '',
    current_consumption_entity: config.current_consumption_entity ?? '',
    image_url: config.image_url ?? '',
    show_energy_flow: config.show_energy_flow ?? false,
    show_top_devices: config.show_top_devices ?? false,
    top_devices_max: Math.min(Math.max(parseInt(String(config.top_devices_max ?? 4), 10) || 4, 1), 8),
    show_solar_forecast: config.show_solar_forecast ?? false,
    weather_entity: config.weather_entity ?? '',
    solar_forecast_today_entity: config.solar_forecast_today_entity ?? '',
    trend_graph_entities: Array.isArray(config.trend_graph_entities)
      ? config.trend_graph_entities
      : [],
    yield_today_entity: config.yield_today_entity ?? '',
    grid_consumption_today_entity: config.grid_consumption_today_entity ?? '',
    battery_percentage_entity: config.battery_percentage_entity ?? '',
    inverter_state_entity: config.inverter_state_entity ?? '',
    total_yield_entity: config.total_yield_entity ?? '',
    total_grid_consumption_entity: config.total_grid_consumption_entity ?? '',
    battery_capacity_entity: config.battery_capacity_entity ?? '',
    inverter_mode_entity: config.inverter_mode_entity ?? '',
  } satisfies SolarCardConfig;

  if (!normalized.production_entity || !normalized.current_consumption_entity) {
    throw new Error('Solar Card: production_entity and current_consumption_entity are required.');
  }

  return normalized;
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
    yield_today_entity: '',
    grid_consumption_today_entity: '',
    battery_percentage_entity: '',
    inverter_state_entity: '',
    total_yield_entity: '',
    total_grid_consumption_entity: '',
    battery_capacity_entity: '',
    inverter_mode_entity: '',
  } satisfies SolarCardConfig;
}
