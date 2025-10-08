import type { Hass, EntityRegistryEntry, DeviceRegistryEntry } from '../types/ha';

let entityRegistryCache: { ts: number; data: EntityRegistryEntry[] } | null = null;
let deviceRegistryCache: { ts: number; data: DeviceRegistryEntry[] } | null = null;
const TTL_MS = 60_000; // 1 minute cache to reduce chatter

export async function getEntityRegistry(hass: Hass): Promise<EntityRegistryEntry[]> {
  const now = Date.now();
  if (entityRegistryCache && now - entityRegistryCache.ts < TTL_MS) return entityRegistryCache.data;
  const data = await hass.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
  entityRegistryCache = { ts: now, data: Array.isArray(data) ? data : [] };
  return entityRegistryCache.data;
}

export async function getDeviceRegistry(hass: Hass): Promise<DeviceRegistryEntry[]> {
  const now = Date.now();
  if (deviceRegistryCache && now - deviceRegistryCache.ts < TTL_MS) return deviceRegistryCache.data;
  try {
    const data = await hass.callWS<DeviceRegistryEntry[]>({ type: 'config/device_registry/list' });
    deviceRegistryCache = { ts: now, data: Array.isArray(data) ? data : [] };
  } catch (_e) {
    deviceRegistryCache = { ts: now, data: [] };
  }
  return deviceRegistryCache.data;
}

