import { LitElement, html, css, nothing } from 'lit';
import type { Hass } from '../types/ha';

type HassAware = HTMLElement & { hass?: Hass | null; setConfig?: (cfg: unknown) => void };

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<{ createCardElement?: (cfg: unknown) => HTMLElement }>;
  }

  interface HTMLElementTagNameMap {
    'solar-card-energy-flow': SolarCardEnergyFlow;
  }
}

class SolarCardEnergyFlow extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      rowSize: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .energy-section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 12px;
    }
  `;

  hass: Hass | null = null;
  rowSize = 6;

  private _flowEl: HTMLElement | null = null;

  render() {
    if (!this.hass) return nothing;
    return html`<div class="energy-section"><div id="energy-flow"></div></div>`;
  }

  protected async updated(changedProps: Map<string, unknown>) {
    super.updated(changedProps);

    const container = this.shadowRoot?.getElementById('energy-flow');
    if (!container) return;

    if (!this.hass) {
      this._clearFlow(container);
      return;
    }

    if (this._flowEl && this._flowEl.parentElement === container) {
      try {
        (this._flowEl as HassAware).hass = this.hass;
      } catch (_e) {
        // ignore
      }
      return;
    }

    const el = await this._createEnergyCard();
    (el as HassAware).hass = this.hass;
    el.style.setProperty('--row-size', String(this.rowSize));
    container.innerHTML = '';
    container.appendChild(el);
    this._flowEl = el;
  }

  private _clearFlow(container: HTMLElement) {
    container.innerHTML = '';
    this._flowEl = null;
  }

  private async _createEnergyCard(): Promise<HTMLElement> {
    try {
      const helpers = await window.loadCardHelpers?.();
      if (helpers?.createCardElement) {
        const el = helpers.createCardElement({ type: 'energy-sankey' });
        if (el) return el;
      }
    } catch (_e) {
      // ignore
    }
    const fallback = document.createElement('hui-energy-sankey-card');
    (fallback as HassAware).setConfig?.({ type: 'energy-sankey' });
    return fallback;
  }
}

customElements.define('solar-card-energy-flow', SolarCardEnergyFlow);

export { SolarCardEnergyFlow };
