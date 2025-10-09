import type { Hass } from '../types/ha';
import type { EntityRegistryEntry } from '../types/ha';
import { stateIcon } from 'custom-card-helpers';

export function iconForEntity(hass: Hass | null, entityId: string): string {
  const st = hass?.states?.[entityId];
  if (!st) return 'mdi:power-plug';
  const icon = st.attributes?.icon;
  if (icon) return icon;
  // Use HA's stateIcon which derives dynamic icons (e.g., battery level)
  try {
    const dyn = stateIcon(st as any);
    if (typeof dyn === 'string' && dyn) return dyn;
  } catch (_e) {
    /* ignore */
  }
  const domain = entityId.split('.')[0];
  const dc = st.attributes?.device_class;
  // Fallback: dynamic battery icons
  if ((domain === 'sensor' || domain === 'binary_sensor') && dc === 'battery') {
    const s = String(st.state);
    const num = Number(s);
    const level = Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : Number.NaN;
    const charging = Boolean(
      st.attributes?.charging === true ||
        st.attributes?.battery_charging === true ||
        String(st.attributes?.charging).toLowerCase() === 'on',
    );
    if (!Number.isNaN(level)) {
      const step =
        level >= 95
          ? '100'
          : level >= 85
            ? '90'
            : level >= 75
              ? '80'
              : level >= 65
                ? '70'
                : level >= 55
                  ? '60'
                  : level >= 45
                    ? '50'
                    : level >= 35
                      ? '40'
                      : level >= 25
                        ? '30'
                        : level >= 15
                          ? '20'
                          : '10';
      if (charging) return `mdi:battery-charging-${step}`;
      return step === '100' ? 'mdi:battery' : `mdi:battery-${step}`;
    }
    return 'mdi:battery';
  }
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
