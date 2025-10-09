import { LitElement, html, nothing } from 'lit';

type DisplayValue = { value: string; unit: string };

export class SolarMetrics extends LitElement {
  static get properties() {
    return {
      today: { attribute: false },
      totals: { attribute: false },
      labels: { attribute: false },
    };
  }

  today!: { yieldToday: DisplayValue; gridToday: DisplayValue; yieldEntity: string | null; gridEntity: string | null };
  totals!: Array<{ key: string; label: string; value: string; unit: string; icon: string | null; entity: string | null }>;
  labels: { yieldToday: string; gridToday: string } = { yieldToday: 'Yield today', gridToday: 'Grid today' };

  createRenderRoot() { return this; }

  private _emitMetricClick = (ev: Event) => {
    const attr = 'data-entity';
    let hit: HTMLElement | undefined;
    const anyEv = ev as any;
    if (typeof anyEv.composedPath === 'function') {
      const path = anyEv.composedPath() as EventTarget[];
      hit = path.find((n) => (n as HTMLElement)?.getAttribute?.(attr)) as HTMLElement | undefined;
    }
    if (!hit) {
      let n = ev.currentTarget as HTMLElement | null;
      if (!n) n = ev.target as HTMLElement | null;
      while (n) {
        if (n.getAttribute && n.getAttribute(attr)) { hit = n; break; }
        n = n.parentElement;
      }
    }
    const entityId = hit?.getAttribute?.(attr) || undefined;
    const key = hit?.getAttribute?.('data-metric-key') || undefined;
    this.dispatchEvent(new CustomEvent('metric-click', { detail: { entityId, key }, bubbles: true, composed: true }));
  };

  render() {
    const t = this.today || {
      yieldToday: { value: '—', unit: '' },
      gridToday: { value: '—', unit: '' },
      yieldEntity: null,
      gridEntity: null,
    };
    const totals = Array.isArray(this.totals) ? this.totals : [];
    const items: unknown[] = [
      html`<div class="metric metric-top" data-entity="${t.yieldEntity || ''}" @click=${this._emitMetricClick}>
        <ha-icon class="icon" icon="mdi:solar-power-variant"></ha-icon>
        <div class="label">${this.labels.yieldToday}</div>
        <div class="value smaller">${t.yieldToday.value}${t.yieldToday.unit ? html` ${t.yieldToday.unit}` : ''}</div>
      </div>`,
      html`<div class="metric metric-top" data-entity="${t.gridEntity || ''}" @click=${this._emitMetricClick}>
        <ha-icon class="icon" icon="mdi:transmission-tower"></ha-icon>
        <div class="label">${this.labels.gridToday}</div>
        <div class="value smaller">${t.gridToday.value}${t.gridToday.unit ? html` ${t.gridToday.unit}` : ''}</div>
      </div>`,
      ...totals.map(
        (m) => html`<div class="metric metric-bottom" data-metric-key="${m.key}" data-entity="${m.entity || ''}" @click=${this._emitMetricClick}>
          ${m.icon ? html`<ha-icon class="icon" icon="${m.icon}"></ha-icon>` : html`<span class="icon placeholder"></span>`}
          <div class="label">${m.label}</div>
          <div class="value smaller">${m.value}${m.unit ? html` ${m.unit}` : nothing}</div>
        </div>`,
      ),
    ];
    const columns = Math.min(Math.max(items.length, 1), 4);
    const grouped: Array<Array<unknown>> = items.reduce((acc: Array<Array<unknown>>, item, idx) => {
      const col = idx % columns;
      if (!acc[col]) acc[col] = [];
      acc[col].push(item);
      return acc;
    }, []);
    return grouped.length
      ? html` <div class="metrics-grid" style="--metrics-cols: ${columns}">
          ${grouped.map((columnItems) => html`<div class="metric-column">${columnItems}</div>`)}
        </div>`
      : nothing;
  }
}

customElements.define('solar-metrics', SolarMetrics);
