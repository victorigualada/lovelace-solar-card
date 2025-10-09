import { navigate } from 'custom-card-helpers';
import type { Hass, EntityRegistryEntry } from '../types/ha';

export function navigateToPath(host: HTMLElement, path: string) {
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof navigate === 'function') {
    try {
      navigate(host, targetPath);
      return;
    } catch (_err) {
      // fall back to default handling
    }
  }
  window.location.assign(targetPath);
}

export async function openBadgeTarget(
  host: HTMLElement,
  hass: Hass,
  statId: string,
  entityRegistry?: EntityRegistryEntry[] | null,
) {
  try {
    const reg = entityRegistry ?? (await hass.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' }));
    let entityId = statId;
    if (!entityId.includes('.')) {
      navigateToPath(host, `/developer-tools/statistics?statistic_id=${encodeURIComponent(statId)}`);
      return;
    }
    const entry = reg.find((e) => e.entity_id === entityId);
    if (entry?.device_id) {
      navigateToPath(host, `/config/devices/device/${entry.device_id}`);
      return;
    }
    const ev = new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true });
    host.dispatchEvent(ev);
  } catch (_e) {
    navigateToPath(host, `/developer-tools/statistics?statistic_id=${encodeURIComponent(statId)}`);
  }
}
