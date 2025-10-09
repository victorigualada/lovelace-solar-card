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
  private _leaving: Map<string, { id: string; name: string; icon?: string; watts?: number }> = new Map();
  private _lastIds: Set<string> = new Set();
  private _prevItems: Array<{ id: string; name: string; icon?: string; watts?: number }> = [];
  private _prevTotal = 0;

  createRenderRoot() {
    return this;
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (!changed.has('items')) return;
    const incoming = Array.isArray(this.items) ? this.items : [];
    const newIds = new Set(incoming.map((i) => i.id));
    // Compute previous total before updating snapshot
    this._prevTotal = this._prevItems.reduce(
      (s, it) => s + (typeof it?.watts === 'number' && isFinite(it.watts) ? it.watts : 0),
      0,
    );
    // Add removed items to leaving map from previous snapshot
    for (const it of this._prevItems) {
      if (!newIds.has(it.id)) this._leaving.set(it.id, { ...it });
    }
    // Ensure items that are present are not marked leaving
    for (const id of newIds) this._leaving.delete(id);
    this._lastIds = newIds;
    this._prevItems = incoming.map((i) => ({ ...i }));
  }

  private _onAnimEnd = (ev: AnimationEvent) => {
    const el = ev.currentTarget as HTMLElement | null;
    if (!el) return;
    if (el.classList.contains('leave')) {
      const id = el.getAttribute('data-stat-id') || '';
      this._leaving.delete(id);
      this.requestUpdate();
    }
  };

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
        if (n.classList?.contains('badge')) {
          hit = n;
          break;
        }
        n = n.parentElement;
      }
    }
    const statId = hit?.getAttribute?.('data-stat-id');
    if (statId)
      this.dispatchEvent(new CustomEvent('device-selected', { detail: { statId }, bubbles: true, composed: true }));
  };

  render() {
    const list = Array.isArray(this.items) ? this.items : [];
    const leaving = Array.from(this._leaving.values());
    const display = [...list, ...leaving];
    // Use total watts to compute proportional usage per badge (share of row)
    const total = list.reduce((s, it) => s + (typeof it?.watts === 'number' && isFinite(it.watts) ? it.watts : 0), 0);
    const newIds = new Set(list.map((i) => i.id));
    return html` <div class="devices-row" id="devices-row">
      <style>
        ${DEVICES_STYLE_CSS}
      </style>
      <div class="badges">
        ${display.map(
          (it) => {
            const hasVal = typeof it.watts === 'number' && isFinite(it.watts as number);
            const isLeaving = !newIds.has(it.id);
            const denom = isLeaving ? this._prevTotal : total;
            const pct = denom > 0 && hasVal
              ? Math.max(0, Math.min(1, (it.watts as number) / denom))
              : 0;
            const tier = pct >= 2 / 3 ? 3 : pct >= 1 / 3 ? 2 : 1;
            const classes = `badge tier-${tier}${hasVal ? '' : ' no-value'}${isLeaving ? ' leave' : ''}`;
            const usage = `${Math.round(pct * 100)}%`;
            return html`<div
              class="${classes}"
              role="listitem"
              data-stat-id="${it.id}"
              style="--badge-usage: ${usage}"
              @animationend=${this._onAnimEnd}
              @click=${this._onBadgeClick}
            >
              <ha-icon icon="${it.icon || 'mdi:power-plug'}"></ha-icon>
              <span class="name">${it.name}</span>
              <span class="value"
                >${it.watts != null
                  ? `${formatNumberLocale(it.watts, this.hass, { maximumFractionDigits: 0 })} W`
                  : ''}</span
              >
            </div>`;
          },
        )}
      </div>
    </div>`;
  }
}

customElements.define('solar-devices-row', SolarDevicesRow);
