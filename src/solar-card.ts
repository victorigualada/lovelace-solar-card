// Home Assistant Solar Card
// Element: solar-card

import { LitElement, html, nothing } from 'lit';
import { localize } from './localize/localize';
import { entityDisplay } from './utils/entity';
import { formatTodayDate } from './utils/date';
import { computeTotalsMetrics } from './viewmodels/totals';
import { ensureTodayDelta } from './services/history';
import { getEntityRegistry } from './services/registries';
import { renderEnergyFlow } from './features/energy-flow';
import { renderTrendGraphs, buildTrendTileConfigs } from './features/trend-graphs';
import { cardStyles } from './styles/card.styles';
import { normalizeConfig, buildCandidateLists as buildCandidatesUtil, getStubConfig as getStub } from './utils/config';
import { computeToday } from './viewmodels/today';
import { computeOverview } from './viewmodels/overview';
import { computeForecast } from './viewmodels/forecast';
import { createDeviceLiveManager, type DeviceLiveManager } from './services/device-live';
// Ensure the visual editor is registered when this module loads
import './solar-card-editor';
import './components/overview';
import './components/metrics';
import './components/forecast';
import './components/devices-row';
import type { Hass, EntityRegistryEntry } from './types/ha';
import { openBadgeTarget } from './utils/navigation';
import type {
  SolarCardConfig,
} from './types';
type HassAware = HTMLElement & { hass?: Hass | null; setConfig?: (cfg: unknown) => void };

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
    loadCardHelpers?: () => Promise<{ createCardElement?: (cfg: unknown) => HTMLElement }>;
  }
}

// Register card in the Add Card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'solar-card',
  name: 'Solar Energy Card',
  description: 'Left panel: yield today, current consumption, title, and image.',
  preview: true,
  documentationURL: 'https://github.com/victorigualada/lovelace-solar-card',
});

class HaSolarCard extends LitElement {
  private _hass: Hass | null;
  private _config: SolarCardConfig;
  private _energyFlowEl: HTMLElement | null;
  private _gridKwhEl: HTMLElement | null; // legacy single graph
  private _trendGraphEls: HTMLElement[] | null;
  private _entityRegistry: EntityRegistryEntry[] | null;
  private _deviceManager: DeviceLiveManager | null;
  private _lastLang?: string | null;
  
  constructor() {
    super();
    this._config = { type: 'custom:solar-card' } as SolarCardConfig;
    this._hass = null;
    this._energyFlowEl = null;
    this._gridKwhEl = null;
    this._trendGraphEls = null;
    this._entityRegistry = null;
    this._deviceManager = null;
    this._lastLang = null;
  }

  static styles = cardStyles;

  static get properties() {
    return {
      _hass: { attribute: false },
      _config: { attribute: false },
      _deviceBadges: { attribute: false },
    };
  }

  static getConfigElement() {
    return document.createElement('solar-card-editor');
  }

  static buildCandidateLists(hass?: Hass, entities?: string[], entitiesFallback?: string[]) {
    return buildCandidatesUtil(hass, entities, entitiesFallback);
  }
  
  static getStubConfig(hass?: Hass, entities?: string[], entitiesFallback?: string[]) {
    return getStub(hass, entities, entitiesFallback);
  }

  get hass(): Hass | null {
    return this._hass;
  }

  set hass(hass: Hass) {
    const prev = this._hass;
    // Keep Energy Flow child card in sync with latest hass without forcing a full re-render
    if (this._energyFlowEl) {
      try {
        (this._energyFlowEl as HassAware).hass = hass;
      } catch (_e) {
        /* ignore */
      }
    }
    if (Array.isArray(this._trendGraphEls)) {
      for (const el of this._trendGraphEls) {
        try { (el as HassAware).hass = hass; } catch (_e) { /* ignore */ }
      }
    }
    if (this._gridKwhEl) {
      try {
        (this._gridKwhEl as HassAware).hass = hass;
      } catch (_e) { /* ignore */ }
    }
    // No localStorage writes: localize() reads HA language directly now.
    // Keep a cached value if we ever need to react to language changes.
    try {
      const lang = (hass?.locale?.language || (hass as any)?.language) ?? null;
      if (lang && lang !== this._lastLang) {
        this._lastLang = lang;
      }
    } catch (_e) {
      /* ignore */
    }
    // Build watched entity list and decide if a re-render is needed
    const cfg = this._config || {};
    const watched = new Set<string>();
    const add = (eid?: string | null) => {
      if (eid) watched.add(eid);
    };
    add(cfg.production_entity);
    add(cfg.current_consumption_entity);
    add(cfg.total_yield_entity);
    add(cfg.total_grid_consumption_entity);
    add(cfg.weather_entity);
    add(cfg.solar_forecast_today_entity);
    if (Array.isArray(cfg.totals_metrics)) {
      for (const metric of cfg.totals_metrics) {
        if (metric && typeof metric === 'object') add(metric.entity);
      }
    }
    if (Array.isArray((cfg as any).trend_graph_entities)) {
      for (const e of (cfg as any).trend_graph_entities) add(e);
    }
    // Device live updates are handled by the DeviceLiveManager
    let changed = !prev; // first assignment always render
    if (prev && watched.size) {
      for (const eid of watched) {
        if (prev.states?.[eid] !== hass.states?.[eid]) {
          changed = true;
          break;
        }
      }
      // Re-render on locale language change to update labels
      if (!changed && prev.locale?.language !== hass.locale?.language) changed = true;
    }
    this._hass = hass;
    if (changed) this.requestUpdate();
  }

  setConfig(config: SolarCardConfig) {
    this._config = normalizeConfig(config);
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._config?.show_top_devices && this._hass) {
      if (!this._deviceManager) {
        this._deviceManager = createDeviceLiveManager(this._hass, () => this.requestUpdate());
      }
      this._deviceManager.start();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._deviceManager?.stop();
  }

  _onDeviceSelected = (ev: CustomEvent) => {
    const statId = (ev.detail && ev.detail.statId) || null;
    if (!statId || !this._hass) return;
    openBadgeTarget(this, this._hass, statId, this._entityRegistry);
  };

  _onMetricComponentClick = (ev: CustomEvent) => {
    const entityId = (ev.detail && ev.detail.entityId) || null;
    if (!entityId) return;
    const moreInfo = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(moreInfo);
  };

  updated() {
    if (this._config?.show_energy_flow) {
      const container = this.shadowRoot?.getElementById('energy-flow') as HTMLElement | null;
      renderEnergyFlow(this._hass, container, this._energyFlowEl).then((el) => {
        this._energyFlowEl = el;
      });
    }
    const cfg = this._config;
    const tiles = buildTrendTileConfigs(cfg);
    if (tiles.length) {
      const container = this.shadowRoot?.getElementById('graphs-section') as HTMLElement | null;
      renderTrendGraphs({
        hass: this._hass,
        container,
        tileConfigs: tiles,
        existing: this._trendGraphEls,
      }).then((els) => {
        if (els) this._trendGraphEls = els;
      });
    }
  }

  render() {
    const cfg = this._config || {};
    const overview = computeOverview(this._hass, cfg);
    const today = computeToday(
      this._hass,
      cfg,
      (id) => this._hass ? ensureTodayDelta(this._hass, id, () => this.requestUpdate()) : null,
      (id) => this._hass ? ensureTodayDelta(this._hass, id, () => this.requestUpdate()) : null,
    );
    const totalsMetrics = computeTotalsMetrics(this._hass, cfg);
    const forecast = computeForecast(this._hass, cfg);
    const devicesList = cfg.show_top_devices
      ? this._deviceManager?.computeTopDevicesLive(cfg.top_devices_max || 4) || []
      : [];

    // Compose tile configs to render (full tile passthrough + trend graphs + legacy single)
    const tiles = buildTrendTileConfigs(cfg);

    const todayLabels = { yieldToday: localize('card.yield_today'), gridToday: localize('card.grid_today') };

    return html`
      <ha-card>
        <div class="container${cfg.show_solar_forecast ? ' has-forecast' : ''}">
          <solar-overview
            .hass=${this._hass}
            .production=${overview.production}
            .consumption=${overview.consumption}
            .productionEntity=${cfg.production_entity}
            .consumptionEntity=${cfg.current_consumption_entity}
            .imageUrl=${overview.image_url}
            .productionLabel=${localize('card.production')}
            .consumptionLabel=${localize('card.consumption')}
            image-fallback
            style="display: contents"
          ></solar-overview>
          <div class="metrics-panel">
            <solar-metrics .today=${today} .totals=${totalsMetrics} .labels=${todayLabels} @metric-click=${this._onMetricComponentClick}></solar-metrics>
          </div>
          ${cfg.show_solar_forecast
            ? html`<solar-forecast
                .hass=${this._hass}
                .title=${forecast.title}
                .icon=${forecast.icon}
                .majorValue=${forecast.majorValue}
                .majorUnit=${forecast.majorUnit}
                .minor=${forecast.minor}
                .dateText=${formatTodayDate(this._hass)}
                .weatherEntity=${cfg.weather_entity}
                .solarForecastEntity=${cfg.solar_forecast_today_entity}
                style="display: contents"
              ></solar-forecast>`
            : nothing}
        </div>
        ${cfg.show_top_devices && devicesList.length
          ? html`<solar-devices-row .items=${devicesList} .hass=${this._hass} @device-selected=${this._onDeviceSelected}></solar-devices-row>`
          : nothing}
        ${tiles.length
          ? html`<div id="graphs-section" class="graphs-section"></div>`
          : nothing}
        ${cfg.show_energy_flow
          ? html`<div id="energy-section" class="energy-section"><div id="energy-flow"></div></div>`
          : nothing}
      </ha-card>
    `;
  }
}

customElements.define('solar-card', HaSolarCard);
