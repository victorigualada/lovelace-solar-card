import { LitElement, html, nothing } from 'lit';
import type { Hass } from '../types/ha';
import type { DeviceBadgeItem } from '../types/solar-card-config';
import { DEVICES_STYLE_CSS } from '../styles/devices-row.styles';
import { formatPowerWatts } from '../utils/power';

export class SolarDevicesRow extends LitElement {
  static get properties() {
    return {
      items: { attribute: false },
      hass: { attribute: false },
      intensityEnabled: { attribute: false },
    };
  }

  items!: DeviceBadgeItem[];
  hass: Hass | null = null;
  intensityEnabled: boolean = true;
  private _leaving: Map<string, DeviceBadgeItem> = new Map();
  private _prevItems: DeviceBadgeItem[] = [];
  private _prevTotal = 0;
  private _rafScheduled = false;
  private _onResize = () => this._layoutRings();

  createRenderRoot() {
    return this;
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (!changed.has('items') && !changed.has('intensityEnabled')) return;
    const incoming = Array.isArray(this.items) ? this.items : [];
    const newIds = new Set(incoming.map((i) => i.id));
    // Compute previous total before updating snapshot
    if (this.intensityEnabled !== false) {
      this._prevTotal = this._prevItems.reduce((sum, it) => {
        if (it?.id === 'grid-feed') return sum;
        const watts = typeof it?.watts === 'number' && Number.isFinite(it.watts) ? (it.watts as number) : 0;
        return sum + watts;
      }, 0);
    } else {
      this._prevTotal = 0;
    }
    // Add removed items to leaving map from previous snapshot
    for (const it of this._prevItems) {
      if (!newIds.has(it.id)) this._leaving.set(it.id, { ...it });
    }
    // Ensure items that are present are not marked leaving
    for (const id of newIds) this._leaving.delete(id);
    this._prevItems = incoming.map((i) => ({ ...i }));
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._onResize, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._onResize);
  }

  private _onAnimEnd = (ev: AnimationEvent) => {
    const el = ev.currentTarget as HTMLElement | null;
    if (!el) return;
    // Only handle our leave animation end, ignore other animations
    if (el.classList.contains('leave') && ev.animationName === 'badge-out') {
      const ds = el.dataset || {};
      const id = ds.itemId || ds.statId || el.getAttribute('data-item-id') || el.getAttribute('data-stat-id') || '';
      if (id) this._leaving.delete(id);
      this._scheduleRender();
    }
  };

  private _scheduleRender() {
    if (this._rafScheduled) return;
    this._rafScheduled = true;
    requestAnimationFrame(() => {
      this._rafScheduled = false;
      this.requestUpdate();
    });
  }

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
    if (!hit) return;
    const ds = hit.dataset || {};
    const entityId = ds.entityId;
    if (entityId) {
      this.dispatchEvent(
        new CustomEvent('hass-more-info', {
          detail: { entityId },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    const statId = ds.statId || ds.itemId;
    if (statId) {
      this.dispatchEvent(new CustomEvent('device-selected', { detail: { statId }, bubbles: true, composed: true }));
    }
  };

  render() {
    const list = Array.isArray(this.items) ? this.items : [];
    const leaving = Array.from(this._leaving.values());
    const display = [...list, ...leaving];
    // Use total watts to compute proportional usage per badge (share of row)
    const enableIntensity = this.intensityEnabled !== false;
    const total = enableIntensity
      ? list.reduce((sum, it) => {
          if (it?.id === 'grid-feed') return sum;
          const watts = typeof it?.watts === 'number' && Number.isFinite(it.watts) ? (it.watts as number) : 0;
          return sum + watts;
        }, 0)
      : 0;
    const newIds = new Set(list.map((i) => i.id));

    const feedBadges: DeviceBadgeItem[] = [];
    const otherBadges: DeviceBadgeItem[] = [];
    for (const item of display) {
      if (item.id === 'grid-feed') feedBadges.push(item);
      else otherBadges.push(item);
    }

    const renderBadge = (it: DeviceBadgeItem) => {
      const hasVal = typeof it.watts === 'number' && Number.isFinite(it.watts);
      const isLeaving = !newIds.has(it.id);
      const isGridFeed = it.id === 'grid-feed';
      const denom = enableIntensity ? (isLeaving ? this._prevTotal : total) : 0;
      const pct = enableIntensity && !isGridFeed && denom > 0 && hasVal
        ? Math.max(0, Math.min(1, (it.watts as number) / denom))
        : 0;
      const tier = enableIntensity ? (pct >= 2 / 3 ? 3 : pct >= 1 / 3 ? 2 : 1) : 1;
      const classes = `badge tier-${tier}${hasVal ? '' : ' no-value'}${isLeaving ? ' leave' : ''}${
        isGridFeed ? ' grid-feed' : ''
      }${isGridFeed && it.charging ? ' charging' : ''}`;
      const usage = isGridFeed ? '0%' : `${Math.round(pct * 100)}%`;
      const powerText = hasVal ? it.powerText || formatPowerWatts(it.watts as number, this.hass) : '';
      const tooltip = it.name ? (powerText ? `${it.name} • ${powerText}` : it.name) : powerText;
      return html`<div
        class="${classes}"
        role="listitem"
        data-item-id=${it.id}
        data-stat-id=${isGridFeed ? nothing : it.id}
        data-entity-id=${it.entityId || nothing}
        style="--badge-usage: ${usage}"
        title=${tooltip}
        @animationend=${this._onAnimEnd}
        @click=${this._onBadgeClick}
      >
        ${isGridFeed && it.charging
          ? html`<svg class="grid-feed-ring" aria-hidden="true" preserveAspectRatio="none">
              <path class="ring" pathLength="100"></path>
            </svg>`
          : nothing}
        <ha-icon icon="${it.icon || 'mdi:power-plug'}"></ha-icon>
        <span class="name">${it.name}</span>
        <span class="value">${powerText}</span>
      </div>`;
    };

    const showDivider = feedBadges.length > 0 && otherBadges.length > 0;

    return html` <div class="devices-row" id="devices-row">
      <style>
        ${DEVICES_STYLE_CSS}
      </style>
      <div class="badges">
        ${feedBadges.map(renderBadge)}
        ${showDivider ? html`<div class="grid-feed-divider" aria-hidden="true"></div>` : nothing}
        ${otherBadges.map(renderBadge)}
      </div>
    </div>`;
  }

  updated() {
    this._layoutRings();
  }

  private _layoutRings() {
    const badges = (this.querySelectorAll('.badge.grid-feed.charging') || []) as unknown as NodeListOf<HTMLElement>;
    badges.forEach((badge) => {
      const svg = badge.querySelector('svg.grid-feed-ring') as SVGSVGElement | null;
      const path = svg?.querySelector('path.ring') as SVGPathElement | null;
      if (!svg || !path) return;

      const outline = 4; // same visual offset as CSS inset
      const sw = 3; // stroke width in px
      const width = Math.max(0, badge.offsetWidth + outline * 2);
      const height = Math.max(0, badge.offsetHeight + outline * 2);
      const pad = sw / 2;
      const x = pad;
      const y = pad;
      const w = Math.max(0, width - sw);
      const h = Math.max(0, height - sw);
      const r = Math.max(0, Math.min(h / 2, w / 2));

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      // Build a rounded-rect path (stadium when r = h/2)
      const d = [
        `M ${x + r},${y}`,
        `H ${x + w - r}`,
        `A ${r} ${r} 0 0 1 ${x + w},${y + r}`,
        `V ${y + h - r}`,
        `A ${r} ${r} 0 0 1 ${x + w - r},${y + h}`,
        `H ${x + r}`,
        `A ${r} ${r} 0 0 1 ${x},${y + h - r}`,
        `V ${y + r}`,
        `A ${r} ${r} 0 0 1 ${x + r},${y}`,
        'Z',
      ].join(' ');
      path.setAttribute('d', d);
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      path.setAttribute('stroke-width', String(sw));
    });
  }
}

customElements.define('solar-devices-row', SolarDevicesRow);
