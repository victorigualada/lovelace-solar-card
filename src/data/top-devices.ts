import type { Hass, EntityRegistryEntry, DeviceRegistryEntry, EnergyPreferences } from '../types/ha';
import type { DeviceBadgeItem } from '../types/solar-card-config';
import type { StatisticsDuringPeriod } from '../types/stats';

type DeviceList = EnergyPreferences['device_consumption'];

export interface DeviceLookupState {
  devicePowerMap: Record<string, string[]> | null;
  statToDeviceId: Record<string, string> | null | undefined;
  deviceEntitiesMap: Record<string, string[]> | null | undefined;
  deviceIconById: Record<string, string> | null;
  entityRegistryByEntityId: Record<string, EntityRegistryEntry> | null;
}

export interface RegistryState {
  entityRegistry: EntityRegistryEntry[] | null;
  deviceRegistry: DeviceRegistryEntry[] | null;
}

export interface DevicePowerMapResult {
  entityRegistry: EntityRegistryEntry[];
  deviceRegistry: DeviceRegistryEntry[];
  devicePowerMap: Record<string, string[]>;
  statToDeviceId: Record<string, string>;
  deviceEntitiesMap: Record<string, string[]>;
  deviceIconById: Record<string, string>;
  entityRegistryByEntityId: Record<string, EntityRegistryEntry>;
}

export async function ensureDevicePowerMap(
  hass: Hass,
  deviceList: DeviceList,
  registries: RegistryState,
): Promise<DevicePowerMapResult> {
  let entityRegistry = registries.entityRegistry;
  if (!entityRegistry) {
    entityRegistry = await hass.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
  }

  let deviceRegistry = registries.deviceRegistry;
  if (!deviceRegistry) {
    try {
      deviceRegistry = await hass.callWS<DeviceRegistryEntry[]>({ type: 'config/device_registry/list' });
    } catch (_e) {
      deviceRegistry = [];
    }
  }

  const entityRegById: Record<string, EntityRegistryEntry> = {};
  for (const ent of entityRegistry) {
    if (ent?.entity_id) entityRegById[ent.entity_id] = ent;
  }

  const deviceIconById: Record<string, string> = {};
  for (const dev of deviceRegistry) {
    if (dev?.id && dev?.icon) deviceIconById[dev.id] = dev.icon;
  }

  const byDevice: Record<string, string[]> = {};
  for (const ent of entityRegistry) {
    if (!ent.entity_id || !ent.device_id) continue;
    (byDevice[ent.device_id] = byDevice[ent.device_id] || []).push(ent.entity_id);
  }

  const map: Record<string, string[]> = {};
  const statToDevice: Record<string, string> = {};
  const deviceEntities: Record<string, string[]> = {};
  const states = hass.states || {};

  for (const dev of deviceList ?? []) {
    const statId = dev.stat_consumption;
    if (!statId || !statId.includes('.')) continue;
    const entry = entityRegistry.find((e) => e.entity_id === statId);
    const deviceId = entry?.device_id;
    if (!deviceId) continue;
    const candidates = (byDevice[deviceId] || []).filter((eid) => {
      const st = states[eid];
      const dc = st?.attributes?.device_class;
      const unit = st?.attributes?.unit_of_measurement || '';
      return dc === 'power' && /k?W/i.test(unit);
    });
    if (candidates.length) map[statId] = candidates;
    statToDevice[statId] = deviceId;
    deviceEntities[deviceId] = byDevice[deviceId] || [];
  }

  return {
    entityRegistry,
    deviceRegistry,
    devicePowerMap: map,
    statToDeviceId: statToDevice,
    deviceEntitiesMap: deviceEntities,
    deviceIconById,
    entityRegistryByEntityId: entityRegById,
  };
}

export function iconForEntity(hass: Hass | null, entityId: string): string {
  const st = hass?.states?.[entityId];
  if (!st) return 'mdi:power-plug';
  const icon = st.attributes?.icon;
  if (icon) return icon;
  const domain = entityId.split('.')[0];
  const dc = st.attributes?.device_class;
  if (domain === 'light') return 'mdi:lightbulb';
  if (domain === 'switch') return 'mdi:power-plug';
  if (domain === 'fan') return 'mdi:fan';
  if (domain === 'climate') return 'mdi:thermostat';
  if (domain === 'sensor' && dc === 'power') return 'mdi:flash';
  if (domain === 'sensor' && dc === 'energy') return 'mdi:lightning-bolt';
  return 'mdi:power-plug';
}

export function iconForDeviceByStat(
  hass: Hass | null,
  statId: string,
  state: DeviceLookupState,
): string {
  const deviceId = state.statToDeviceId?.[statId];
  if (!deviceId) return 'mdi:power-plug';
  const devIcon = state.deviceIconById?.[deviceId];
  if (devIcon) return devIcon;
  const entities = state.deviceEntitiesMap?.[deviceId] || [];
  if (!entities.length) return 'mdi:power-plug';
  const regById = state.entityRegistryByEntityId || {};
  const states = hass?.states || {};
  const domainPreference = [
    'light',
    'switch',
    'climate',
    'fan',
    'vacuum',
    'media_player',
    'water_heater',
    'humidifier',
    'cover',
  ];

  for (const dom of domainPreference) {
    const eid = entities.find((e) => e.startsWith(dom + '.'));
    const er = eid ? regById[eid] : undefined;
    if (er?.icon) return er.icon;
  }
  for (const eid of entities) {
    const er = regById[eid];
    if (er?.icon) return er.icon;
  }

  for (const dom of domainPreference) {
    const eid = entities.find((e) => e.startsWith(dom + '.'));
    const st = eid ? states[eid] : undefined;
    if (st?.attributes?.icon) return st.attributes.icon;
  }
  for (const eid of entities) {
    const st = states[eid];
    if (st?.attributes?.icon) return st.attributes.icon;
  }

  for (const dom of domainPreference) {
    const eid = entities.find((e) => e.startsWith(dom + '.'));
    if (eid) return iconForEntity(hass, eid);
  }
  for (const eid of entities) {
    if (states[eid]) return iconForEntity(hass, eid);
  }
  return 'mdi:power-plug';
}

export function computeTopDevicesLive(
  hass: Hass | null,
  state: DeviceLookupState,
  deviceList: DeviceList,
  maxCount: number,
): DeviceBadgeItem[] {
  if (!state.devicePowerMap || !deviceList?.length) return [];
  const items: DeviceBadgeItem[] = [];
  for (const dev of deviceList) {
    const statId = dev.stat_consumption;
    const namestr = dev.name || statId;
    const pEntities = state.devicePowerMap[statId] || [];
    let watts: number | null = null;
    for (const pe of pEntities) {
      const val = powerWattsFromState(hass, pe);
      if (val == null) continue;
      if (watts == null || val > watts) {
        watts = Math.max(0, val);
      }
    }
    if (watts != null && watts > 0) {
      const icon = iconForDeviceByStat(hass, statId, state);
      items.push({ id: statId, name: namestr, watts, icon });
    }
  }
  items.sort((a, b) => b.watts - a.watts);
  return items.slice(0, maxCount);
}

function powerWattsFromState(hass: Hass | null, entityId: string): number | null {
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

export async function fetchTopConsumptionDevices(
  hass: Hass,
  maxCount: number,
): Promise<DeviceBadgeItem[]> {
  const prefs = await hass.callWS<EnergyPreferences>({ type: 'energy/get_prefs' });
  const devices = Array.isArray(prefs?.device_consumption) ? prefs.device_consumption : [];
  const statIds = devices.map((d) => d.stat_consumption).filter((s) => !!s);
  if (!statIds.length) return [];
  const end = new Date();
  const start = new Date(end.getTime() - 60 * 60 * 1000);
  const stats = await hass.callWS<StatisticsDuringPeriod>({
    type: 'recorder/statistics_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    statistic_ids: statIds,
    period: '5minute',
  });
  const byId: StatisticsDuringPeriod = (stats as StatisticsDuringPeriod) || {};
  const items: DeviceBadgeItem[] = [];
  for (const dev of devices) {
    const sid = dev.stat_consumption;
    const series = byId?.[sid];
    if (!Array.isArray(series) || series.length < 2) continue;
    let i = series.length - 1;
    while (i >= 0 && (series[i].sum == null || Number.isNaN(Number(series[i].sum)))) i--;
    if (i <= 0) continue;
    let j = i - 1;
    while (j >= 0 && (series[j].sum == null || Number.isNaN(Number(series[j].sum)))) j--;
    if (j < 0) continue;
    const last = series[i];
    const prev = series[j];
    const dtHours = (new Date(last.start).getTime() - new Date(prev.start).getTime()) / 3600000;
    if (dtHours <= 0) continue;
    const deltaKWh = Math.max(0, (last.sum ?? 0) - (prev.sum ?? 0));
    const watts = (deltaKWh / dtHours) * 1000;
    if (!isFinite(watts)) continue;
    items.push({
      id: sid,
      name: dev.name || sid,
      watts,
    });
  }
  items.sort((a, b) => b.watts - a.watts);
  return items.slice(0, maxCount);
}

export function stripDeviceFromName(
  name: string,
  entityId: string | undefined,
  entityRegistry: EntityRegistryEntry[] | null,
  deviceRegistry: DeviceRegistryEntry[] | null,
): string {
  const original = (name || '').trim();
  const dev = deviceNameForEntity(entityId, entityRegistry, deviceRegistry) || '';
  if (!dev) return original;
  const esc = dev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let out = original.replace(new RegExp(esc, 'i'), '').trim();
  out = out.replace(/^[\s\-—–:|•·.]+/, '').trim();
  return out || original;
}

export function deviceNameForEntity(
  entityId: string | undefined,
  entityRegistry: EntityRegistryEntry[] | null,
  deviceRegistry: DeviceRegistryEntry[] | null,
): string | null {
  if (!entityId || !entityRegistry || !deviceRegistry) return null;
  const entry = entityRegistry.find((e) => e?.entity_id === entityId);
  const dev = entry?.device_id ? deviceRegistry.find((d) => d?.id === entry.device_id) : null;
  return dev?.name || null;
}
