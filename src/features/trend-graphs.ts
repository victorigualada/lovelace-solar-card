import type { Hass } from '../types/ha';

type HassAware = HTMLElement & { hass?: Hass | null; setConfig?: (cfg: unknown) => void };

export async function renderTrendGraphs(options: {
  hass: Hass | null;
  container: HTMLElement | null;
  tileConfigs: any[];
  existing: HTMLElement[] | null;
  ensureRegistriesForNames: () => Promise<void>;
  stripDeviceFromName: (name: string, entityId?: string) => string;
}): Promise<HTMLElement[] | null> {
  const { hass, container, tileConfigs, existing, ensureRegistriesForNames, stripDeviceFromName } = options;
  // Ensure registries are available so we can resolve device names for stripping
  await ensureRegistriesForNames();
  if (!container || !tileConfigs?.length) return existing;
  if (Array.isArray(existing) && existing.length === tileConfigs.length) {
    for (const el of existing) {
      try { (el as HassAware).hass = hass; } catch (_e) { /* ignore */ }
    }
    return existing;
  }
  container.innerHTML = '';
  const created: HTMLElement[] = [];
  for (const cfg of tileConfigs) {
    if (!cfg) continue;
    let el: HTMLElement | null = null;
    const ent = (cfg as any).entity as string | undefined;
    let friendly = ent && hass?.states?.[ent]?.attributes?.friendly_name;
    const tileConfig = { type: 'tile', ...cfg } as any;
    if (!('name' in tileConfig) && friendly) tileConfig.name = stripDeviceFromName(String(friendly), ent);
    try {
      const helpers = await window.loadCardHelpers?.();
      if (helpers?.createCardElement) {
        el = helpers.createCardElement(tileConfig);
      }
    } catch (_e) { /* ignore */ }
    if (!el) {
      el = document.createElement('hui-tile-card');
      (el as HassAware).setConfig?.(tileConfig);
    }
    (el as HassAware).hass = hass;
    container.appendChild(el);
    created.push(el);
  }
  return created;
}

