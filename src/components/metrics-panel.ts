import { LitElement, html, css, nothing } from 'lit';
import { localize } from '../localize/localize';
import type { DisplayValue, SolarCardConfig } from '../types/solar-card-config';

export interface MetricsTodayValues {
  yieldToday: DisplayValue;
  gridToday: DisplayValue;
  batteryPct: DisplayValue;
  inverterState: DisplayValue;
}

export interface MetricsTotalsValues {
  totalYield: DisplayValue;
  totalGrid: DisplayValue;
  batteryCapacity: DisplayValue;
  inverterModeDisplay: DisplayValue;
}

class SolarCardMetricsPanel extends LitElement {
  static get properties() {
    return {
      config: { attribute: false },
      today: { attribute: false },
      totals: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .metrics-panel {
      display: grid;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
      gap: 12px;
      align-items: start;
    }

    .metrics-grid .metric {
      min-width: 0;
    }

    .metrics-grid .metric .label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metrics-grid .metric .value {
      font-size: 1.25rem;
    }

    .metric-top {
      display: grid;
      grid-template-columns: 24px 1fr;
      grid-template-rows: auto auto;
      column-gap: 8px;
    }

    .metric-top > .icon {
      grid-row: 1 / span 2;
      align-self: center;
      color: var(--secondary-text-color);
    }

    .metric-top > .label {
      grid-column: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-top > .value {
      grid-column: 2;
      white-space: nowrap;
    }

    .metric-bottom {
      padding-left: 32px;
    }

    .metric .value {
      font-weight: 700;
      font-size: 2rem;
      line-height: 1.1;
    }

    .metric .value.smaller {
      font-size: 1.4rem;
    }

    .today-panel,
    .totals-panel {
      border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-left: 16px;
      padding-right: 16px;
      min-width: 0;
    }

    .today-panel {
      padding: 4px 16px 12px;
    }

    .totals-panel {
      padding: 12px 16px 0;
    }

    @container (max-width: 1200px) {
      :host {
        min-width: calc(100% - 320px);
      }

      .today-panel,
      .totals-panel {
        border-left: none;
        padding-left: 0;
      }

      .metrics-grid {
        border-left: none;
        grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
        min-width: 0;
      }

      .today-panel .metric,
      .totals-panel .metric {
        min-width: 0;
      }
    }

    @container (max-width: 900px) {
      :host {
        min-width: calc(100% - 215px);
      }

      .metrics-grid {
        grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr));
      }

      .metric .value {
        font-size: 1.6rem;
      }

      .metric .value.smaller {
        font-size: 1.2rem;
      }
    }

    @container (max-width: 700px) {
      :host {
        min-width: 100%;
      }

      .metrics-grid {
        grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
      }

      .metric .value {
        font-size: 1.5rem;
      }

      .metric .value.smaller {
        font-size: 1.1rem;
      }
    }

    @container (max-width: 568px) {
      :host {
        width: 100%;
      }

      .metrics-grid {
        grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr));
        min-width: 0;
      }
    }
  `;

  config?: SolarCardConfig;
  today?: MetricsTodayValues;
  totals?: MetricsTotalsValues;

  render() {
    const cfg = this.config;
    if (!cfg) return nothing;

    return html`
      <div class="metrics-panel">
        ${this._renderTodayPanel(cfg, this.today)}
        ${this._renderTotalsPanel(cfg, this.totals)}
      </div>
    `;
  }

  private _renderTodayPanel(cfg: SolarCardConfig, today?: MetricsTodayValues) {
    if (!today) return nothing;

    const showYield = !!(cfg.yield_today_entity || cfg.total_yield_entity);
    const showGrid = !!(cfg.grid_consumption_today_entity || cfg.total_grid_consumption_entity);
    const showBattery = !!cfg.battery_percentage_entity;
    const showInverter = !!cfg.inverter_state_entity;

    const items: unknown[] = [];

    if (showYield) {
      items.push(html`<div class="metric metric-top">
        <ha-icon class="icon" icon="mdi:solar-power-variant"></ha-icon>
        <div class="label">${localize('card.yield_today')}</div>
        <div class="value smaller">${today.yieldToday.value} ${today.yieldToday.unit}</div>
      </div>`);
    }

    if (showGrid) {
      items.push(html`<div class="metric metric-top">
        <ha-icon class="icon" icon="mdi:transmission-tower"></ha-icon>
        <div class="label">${localize('card.grid_today')}</div>
        <div class="value smaller">${today.gridToday.value} ${today.gridToday.unit}</div>
      </div>`);
    }

    if (showBattery) {
      items.push(html`<div class="metric metric-top">
        <ha-icon class="icon" icon="mdi:battery"></ha-icon>
        <div class="label">${localize('card.battery')}</div>
        <div class="value smaller">${today.batteryPct.value} ${today.batteryPct.unit || '%'}</div>
      </div>`);
    }

    if (showInverter) {
      items.push(html`<div class="metric metric-top">
        <ha-icon class="icon" icon="mdi:power"></ha-icon>
        <div class="label">${localize('card.inverter_state')}</div>
        <div class="value smaller">${today.inverterState.value}</div>
      </div>`);
    }

    if (!items.length) return nothing;

    return html`<div class="today-panel metrics-grid" style="--metrics-cols: ${items.length}">${items}</div>`;
  }

  private _renderTotalsPanel(cfg: SolarCardConfig, totals?: MetricsTotalsValues) {
    if (!totals) return nothing;

    const items: unknown[] = [];

    if (cfg.total_yield_entity) {
      items.push(html`<div class="metric metric-bottom">
        <div class="label">${localize('card.total_yield')}</div>
        <div class="value smaller">${totals.totalYield.value} ${totals.totalYield.unit}</div>
      </div>`);
    }

    if (cfg.total_grid_consumption_entity) {
      items.push(html`<div class="metric metric-bottom">
        <div class="label">${localize('card.grid_consumption')}</div>
        <div class="value smaller">${totals.totalGrid.value} ${totals.totalGrid.unit}</div>
      </div>`);
    }

    if (cfg.battery_capacity_entity) {
      items.push(html`<div class="metric metric-bottom">
        <div class="label">${localize('card.battery_capacity')}</div>
        <div class="value smaller">${totals.batteryCapacity.value} ${totals.batteryCapacity.unit}</div>
      </div>`);
    }

    if (cfg.inverter_mode_entity) {
      items.push(html`<div class="metric metric-bottom">
        <div class="label">${localize('card.inverter_mode')}</div>
        <div class="value smaller">${totals.inverterModeDisplay.value}</div>
      </div>`);
    }

    if (!items.length) return nothing;

    return html`<div class="totals-panel metrics-grid" style="--metrics-cols: ${items.length}">${items}</div>`;
  }
}

customElements.define('solar-card-metrics-panel', SolarCardMetricsPanel);

export { SolarCardMetricsPanel };
