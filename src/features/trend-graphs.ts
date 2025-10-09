import type { Hass } from '../types/ha';
import { getEntityRegistry, getDeviceRegistry } from '../services/registries';

type HassAware = HTMLElement & { hass?: Hass | null; setConfig?: (cfg: unknown) => void };

let cachedEntityReg: any[] | null = null;
let cachedDeviceReg: any[] | null = null;

async function ensureRegistries(hass: Hass | null) {
  if (!hass) return;
  if (!cachedEntityReg) cachedEntityReg = await getEntityRegistry(hass);
  if (!cachedDeviceReg) cachedDeviceReg = await getDeviceRegistry(hass);
}

function deviceNameForEntity(entityId?: string): string | null {
  if (!entityId || !cachedEntityReg || !cachedDeviceReg) return null;
  const entry = cachedEntityReg.find((e: any) => e?.entity_id === entityId);
  const dev = entry?.device_id ? cachedDeviceReg.find((d: any) => d?.id === entry.device_id) : null;
  return dev?.name || null;
}

function stripDeviceFromName(name: string, entityId?: string): string {
  const original = (name || '').trim();
  const dev = deviceNameForEntity(entityId || '') || '';
  if (!dev) return original;
  const esc = dev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let out = original.replace(new RegExp(esc, 'i'), '').trim();
  out = out.replace(/^[\s\-—–:|•·.]+/, '').trim();
  return out || original;
}

export async function renderTrendGraphs(options: {
  hass: Hass | null;
  container: HTMLElement | null;
  tileConfigs: any[];
  existing: HTMLElement[] | null;
}): Promise<HTMLElement[] | null> {
  const { hass, container, tileConfigs, existing } = options;
  await ensureRegistries(hass);
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

export function buildTrendTileConfigs(cfg: any): any[] {
  const tiles: any[] = [];
  const rawTiles = Array.isArray((cfg as any)?.feature_tiles) ? ((cfg as any).feature_tiles as any[]) : [];
  for (const t of rawTiles) {
    if (t && typeof t === 'object') tiles.push({ type: 'tile', ...t });
  }
  const ents = Array.isArray((cfg as any)?.trend_graph_entities) ? ((cfg as any).trend_graph_entities as string[]) : [];
  const merged = new Set<string>(ents);
  const defHours = Number((cfg as any)?.trend_graph_hours_to_show) || 24;
  const defDetail = Number((cfg as any)?.trend_graph_detail) || undefined;
  for (const entityId of Array.from(merged)) {
    const features: any[] = [ { type: 'trend-graph', hours_to_show: defHours } ];
    if (defDetail != null) features[0].detail = defDetail;
    tiles.push({ type: 'tile', entity: entityId, features });
  }
  return tiles;
}
