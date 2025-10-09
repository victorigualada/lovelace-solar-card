import { LitElement, html } from 'lit';
import type { Hass } from '../types/ha';
import { formatNumberLocale } from '../utils/format';
import { DEVICES_STYLE_CSS } from '../styles/devices-row.styles';

export class SolarDevicesRow extends LitElement {
  static get properties() {
    return {
      items: { attribute: false },
      hass: { attribute: false },
    };
  }

  items!: Array<{ id: string; name: string; icon?: string; watts?: number }>;
  hass: Hass | null = null;

  createRenderRoot() { return this; }

  private _onBadgeClick = (ev: Event) => {
    const anyEv = ev as any;
    let hit: HTMLElement | undefined;
    if (typeof anyEv.composedPath === 'function') {
      const path = anyEv.composedPath() as EventTarget[];
      hit = path.find((n) => (n as HTMLElement)?.classList?.contains?.('badge')) as HTMLElement | undefined;
    }
    if (!hit) {
      let n = ev.target as HTMLElement | null;
      while (n) {
        if (n.classList?.contains('badge')) { hit = n; break; }
        n = n.parentElement;
      }
    }
    const statId = hit?.getAttribute?.('data-stat-id');
    if (statId) this.dispatchEvent(new CustomEvent('device-selected', { detail: { statId }, bubbles: true, composed: true }));
  };


  render() {
    const list = Array.isArray(this.items) ? this.items : [];
    return html` <div class="devices-row" id="devices-row">
      <style>${DEVICES_STYLE_CSS}</style>
      <div class="badges">
        ${list.map(
          (it) => html`<div class="badge" role="listitem" data-stat-id="${it.id}" @click=${this._onBadgeClick}>
            <ha-icon icon="${it.icon || 'mdi:power-plug'}"></ha-icon>
            <span class="name">${it.name}</span>
            <span class="value">${it.watts != null ? `${formatNumberLocale(it.watts, this.hass, { maximumFractionDigits: 0 })} W` : ''}</span>
          </div>`,
        )}
      </div>
    </div>`;
  }
}

customElements.define('solar-devices-row', SolarDevicesRow);
