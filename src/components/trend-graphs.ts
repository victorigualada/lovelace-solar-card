import { LitElement, html, css, nothing } from 'lit';
import type { Hass } from '../types/ha';

type HassAware = HTMLElement & { hass?: Hass | null; setConfig?: (cfg: unknown) => void };

type EnsureRegistriesFn = () => Promise<void>;
type StripNameFn = (name: string, entityId?: string) => string;

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<{ createCardElement?: (cfg: unknown) => HTMLElement }>;
  }

  interface HTMLElementTagNameMap {
    'solar-card-trend-graphs': SolarCardTrendGraphs;
  }
}

class SolarCardTrendGraphs extends LitElement {
  static get properties() {
    return {
      tiles: { attribute: false },
      hass: { attribute: false },
      ensureRegistriesForNames: { attribute: false },
      stripName: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .graphs-section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  `;

  tiles: any[] = [];
  hass: Hass | null = null;
  ensureRegistriesForNames?: EnsureRegistriesFn;
  stripName?: StripNameFn;

  private _graphEls: HTMLElement[] = [];
  private _tilesSignature: string | null = null;

  render() {
    if (!this.tiles?.length) return nothing;
    return html`<div class="graphs-section" id="graphs-section"></div>`;
  }

  protected async updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    if (!this.tiles?.length) {
      this._clearGraphs();
      return;
    }

    const container = this.shadowRoot?.getElementById('graphs-section');
    if (!container) return;

    const signature = this._computeSignature(this.tiles);
    const sameTiles = signature === this._tilesSignature && this._graphEls.length === this.tiles.length;

    if (sameTiles) {
      this._updateGraphsHass();
      return;
    }

    if (this.ensureRegistriesForNames) {
      try {
        await this.ensureRegistriesForNames();
      } catch (_e) {
        // ignore registry errors
      }
    }

    container.innerHTML = '';
    this._graphEls = [];
    this._tilesSignature = signature;

    for (const cfg of this.tiles) {
      if (!cfg) continue;
      const tileConfig: Record<string, any> = { type: 'tile', ...cfg };
      const entityId = (tileConfig as any).entity as string | undefined;
      if (!('name' in tileConfig) && entityId) {
        const friendly = this.hass?.states?.[entityId]?.attributes?.friendly_name;
        if (friendly) {
          tileConfig.name = this.stripName ? this.stripName(String(friendly), entityId) : friendly;
        }
      }
      const el = await this._createTileElement(tileConfig);
      (el as HassAware).hass = this.hass;
      container.appendChild(el);
      this._graphEls.push(el);
    }
  }

  private _clearGraphs() {
    this._tilesSignature = null;
    if (!this._graphEls.length) return;
    for (const el of this._graphEls) {
      try {
        el.remove();
      } catch (_e) {
        // ignore
      }
    }
    this._graphEls = [];
  }

  private _updateGraphsHass() {
    for (const el of this._graphEls) {
      try {
        (el as HassAware).hass = this.hass;
      } catch (_e) {
        // ignore individual tile failures
      }
    }
  }

  private _computeSignature(tiles: any[]): string {
    try {
      return JSON.stringify(tiles);
    } catch (_e) {
      return String(Date.now());
    }
  }

  private async _createTileElement(config: Record<string, any>): Promise<HTMLElement> {
    try {
      const helpers = await window.loadCardHelpers?.();
      if (helpers?.createCardElement) {
        const el = helpers.createCardElement(config);
        if (el) return el;
      }
    } catch (_e) {
      // ignore helper failures and fallback below
    }
    const fallback = document.createElement('hui-tile-card');
    (fallback as HassAware).setConfig?.(config);
    return fallback;
  }
}

customElements.define('solar-card-trend-graphs', SolarCardTrendGraphs);

export { SolarCardTrendGraphs };
