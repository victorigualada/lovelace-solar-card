import type { Hass, EntityRegistryEntry } from '../types/ha';
import type { EnergyPreferences } from '../types/ha';
import type { DeviceBadgeItem } from '../types/solar-card-config';
import { getEnergyPrefs, buildDevicePowerMapping } from './devices';
import { powerWattsFromState } from '../utils/power';
import { iconForDeviceByStat } from '../utils/icons';

export type DeviceLiveManager = ReturnType<typeof createDeviceLiveManager>;

export function createDeviceLiveManager(hass: Hass, onUpdate: () => void) {
  // Keep a mutable reference so we can update hass on every setter call
  let haRef: Hass = hass;
  let refreshing = false;
  let lastFetch = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let deviceList: EnergyPreferences['device_consumption'] = [];
  let devicePowerMap: Record<string, string[]> = {};
  let statToDeviceId: Record<string, string> = {};
  let deviceEntitiesMap: Record<string, string[]> = {};
  let entityRegistryByEntityId: Record<string, EntityRegistryEntry> = {} as any;
  let deviceIconById: Record<string, string> = {};

  async function refresh() {
    const now = Date.now();
    if (refreshing) return;
    if (now - lastFetch < 60_000) return;
    refreshing = true;
    try {
      const prefs = await getEnergyPrefs(haRef);
      deviceList = Array.isArray(prefs?.device_consumption) ? prefs.device_consumption : [];
      const res = await buildDevicePowerMapping(haRef, deviceList);
      devicePowerMap = res.devicePowerMap;
      statToDeviceId = res.statToDeviceId;
      deviceEntitiesMap = res.deviceEntitiesMap as any;
      entityRegistryByEntityId = res.entityRegistryByEntityId as any;
      deviceIconById = res.deviceIconById;
      lastFetch = Date.now();
      onUpdate();
    } finally {
      refreshing = false;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        lastFetch = 0;
        refresh();
      }, 60_000);
    }
  }

  function computeTopDevicesLive(maxCount: number): DeviceBadgeItem[] {
    if (!devicePowerMap || !deviceList?.length) return [];
    const items: DeviceBadgeItem[] = [];
    for (const dev of deviceList) {
      const statId = dev.stat_consumption;
      const namestr = dev.name || statId;
      const pEntities = devicePowerMap[statId] || [];
      let watts: number | null = null;
      for (const pe of pEntities) {
        const val = powerWattsFromState(haRef, pe);
        if (val == null) continue;
        if (watts == null || val > watts) {
          watts = Math.max(0, val);
        }
      }
      if (watts != null && watts > 0) {
        const icon = iconForDeviceByStat(statId, haRef, {
          statToDeviceId,
          deviceIconById,
          deviceEntitiesMap,
          entityRegistryByEntityId,
        });
        items.push({ id: statId, name: namestr, watts, icon });
      }
    }
    items.sort((a, b) => b.watts - a.watts);
    return items.slice(0, maxCount);
  }

  function start() {
    refresh();
  }

  function stop() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  return {
    start,
    stop,
    refresh,
    computeTopDevicesLive,
    setHass(h: Hass) {
      haRef = h;
    },
  };
}
