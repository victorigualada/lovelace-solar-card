import type { Hass } from '../types/ha';

type HassAware = HTMLElement & { hass?: Hass | null; setConfig?: (cfg: unknown) => void };

export async function renderEnergyFlow(
  hass: Hass | null,
  container: HTMLElement | null,
  existing: HTMLElement | null,
): Promise<HTMLElement | null> {
  if (!container) return existing;
  if (existing && existing.parentElement === container) {
    (existing as HassAware).hass = hass;
    return existing;
  }
  let el: HTMLElement | null = null;
  try {
    const helpers = await window.loadCardHelpers?.();
    if (helpers?.createCardElement) {
      el = helpers.createCardElement({ type: 'energy-sankey' });
    }
  } catch (_e) {
    // ignore, try fallback below
  }
  if (!el) {
    el = document.createElement('hui-energy-sankey-card');
    (el as HassAware).setConfig?.({ type: 'energy-sankey' });
  }
  (el as HassAware).hass = hass;
  el.style.setProperty('--row-size', '6');
  container.innerHTML = '';
  container.appendChild(el);
  return el;
}

