import type { Hass } from '../types/ha';
import type { EntityRegistryEntry } from '../types/ha';

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
  statId: string,
  hass: Hass | null,
  opts: {
    statToDeviceId?: Record<string, string> | null;
    deviceIconById?: Record<string, string> | null;
    deviceEntitiesMap?: Record<string, string[]> | null;
    entityRegistryByEntityId?: Record<string, EntityRegistryEntry> | null;
  },
): string {
  const deviceId = opts.statToDeviceId?.[statId];
  if (!deviceId) return 'mdi:power-plug';
  const devIcon = opts.deviceIconById?.[deviceId];
  if (devIcon) return devIcon;
  const entities = opts.deviceEntitiesMap?.[deviceId] || [];
  if (!entities.length) return 'mdi:power-plug';
  const states = hass?.states || {};
  const regById = opts.entityRegistryByEntityId || {};
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
    if (er?.icon) return er.icon as string;
  }
  for (const eid of entities) {
    const er = regById[eid];
    if (er?.icon) return er.icon as string;
  }
  for (const dom of domainPreference) {
    const eid = entities.find((e) => e.startsWith(dom + '.'));
    const st = eid ? states[eid] : undefined;
    if (st?.attributes?.icon) return st.attributes.icon as string;
  }
  for (const eid of entities) {
    const st = states[eid];
    if (st?.attributes?.icon) return st.attributes.icon as string;
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

