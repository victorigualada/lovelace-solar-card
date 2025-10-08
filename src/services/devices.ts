import type {
  Hass,
  EntityRegistryEntry,
  DeviceRegistryEntry,
  EnergyPreferences,
} from '../types/ha';

import { getEntityRegistry, getDeviceRegistry } from './registries';

export async function getEnergyPrefs(hass: Hass): Promise<EnergyPreferences> {
  return hass.callWS<EnergyPreferences>({ type: 'energy/get_prefs' });
}

export async function openDeviceOrEntity(
  hass: Hass,
  host: HTMLElement,
  statId: string,
  entityRegistry?: EntityRegistryEntry[] | null,
) {
  try {
    const reg = entityRegistry ?? (await getEntityRegistry(hass));
    let entityId = statId;
    if (!entityId.includes('.')) {
      window.open(`/developer-tools/statistics?statistic_id=${encodeURIComponent(statId)}`, '_blank');
      return;
    }
    const entry = reg.find((e) => e.entity_id === entityId);
    if (entry?.device_id) {
      window.open(`/config/devices/device/${entry.device_id}`, '_blank');
      return;
    }
    const ev = new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true });
    host.dispatchEvent(ev);
  } catch (_e) {
    window.open(`/developer-tools/statistics?statistic_id=${encodeURIComponent(statId)}`, '_blank');
  }
}

export async function buildDevicePowerMapping(
  hass: Hass,
  deviceList: EnergyPreferences['device_consumption'] | undefined,
): Promise<{
  devicePowerMap: Record<string, string[]>;
  statToDeviceId: Record<string, string>;
  deviceEntitiesMap: Record<string, string[]>;
  entityRegistryByEntityId: Record<string, EntityRegistryEntry>;
  deviceIconById: Record<string, string>;
}> {
  const reg = await getEntityRegistry(hass);
  const dreg = await getDeviceRegistry(hass);

  const entityRegistryByEntityId: Record<string, EntityRegistryEntry> = {};
  for (const ent of reg) {
    if (ent?.entity_id) entityRegistryByEntityId[ent.entity_id] = ent;
  }
  const deviceIconById: Record<string, string> = {};
  for (const dev of dreg) {
    if (dev?.id && dev?.icon) deviceIconById[dev.id] = dev.icon;
  }
  const byDevice: Record<string, string[]> = {};
  for (const ent of reg) {
    if (!ent?.entity_id || !ent?.device_id) continue;
    (byDevice[ent.device_id] = byDevice[ent.device_id] || []).push(ent.entity_id);
  }

  const devicePowerMap: Record<string, string[]> = {};
  const statToDeviceId: Record<string, string> = {};
  const deviceEntitiesMap: Record<string, string[]> = {};
  const states = hass.states || {};
  for (const dev of deviceList ?? []) {
    const statId = dev.stat_consumption;
    if (!statId || !statId.includes('.')) continue;
    const entry = reg.find((e) => e.entity_id === statId);
    const deviceId = entry?.device_id;
    if (!deviceId) continue;
    const candidates = (byDevice[deviceId] || []).filter((eid) => {
      const st = states[eid];
      const dc = st?.attributes?.device_class;
      const unit = st?.attributes?.unit_of_measurement || '';
      return dc === 'power' && /k?W/i.test(unit);
    });
    if (candidates.length) devicePowerMap[statId] = candidates;
    statToDeviceId[statId] = deviceId;
    deviceEntitiesMap[deviceId] = byDevice[deviceId] || [];
  }

  return { devicePowerMap, statToDeviceId, deviceEntitiesMap, entityRegistryByEntityId, deviceIconById };
}

