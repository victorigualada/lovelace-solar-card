// Home Assistant Solar Card
// Element: solar-card

import { LitElement, html, css, nothing, svg } from 'lit';
import { navigate } from 'custom-card-helpers';
import { localize } from './localize/localize';
// Ensure the visual editor is registered when this module loads
import './solar-card-editor';
import type { Hass, HassEntity, EntityRegistryEntry, DeviceRegistryEntry, EnergyPreferences } from './types/ha';
import type { SolarCardConfig, DisplayValue, DeviceBadgeItem } from './types/solar-card-config';
import type { StatisticsDuringPeriod, HistoryPeriodResponse } from './types/stats';
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

const UNAVAILABLE_STATES = new Set(['unknown', 'unavailable', 'none']);

function escapeHtml(str: unknown): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNumberLocale(value: unknown, hass: Hass | null, options: Intl.NumberFormatOptions = {}): string {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  const locale = hass?.locale?.language || hass?.language || navigator.language || 'en';
  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch (_e) {
    return String(num);
  }
}

function entityDisplay(hass: Hass | null, entityId?: string | null): DisplayValue {
  if (!entityId) return { value: '—', unit: '' };
  const stateObj = hass?.states?.[entityId as string] as HassEntity | undefined;
  if (!stateObj) return { value: '—', unit: '' };
  const unit = stateObj.attributes.unit_of_measurement || '';
  const state = stateObj.state;
  if (UNAVAILABLE_STATES.has(state)) return { value: '—', unit };
  const value = formatNumberLocale(state, hass, { maximumFractionDigits: 2 });
  return { value, unit };
}

class HaSolarCard extends LitElement {
  private _boundDeviceRowClick?: WeakSet<HTMLElement>;
  static get properties() {
    return {
      _hass: { attribute: false },
      _config: { attribute: false },
      _deviceBadges: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      --label-color: var(--secondary-text-color);
      container-type: inline-size;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 0;
      align-items: stretch;
      grid-auto-rows: auto;
    }
    .container.has-forecast {
      grid-template-columns: 1fr 2fr auto;
    }

    /* Overview (content + image) */
    .overview-panel {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 40px;
      align-items: center;
      padding-right: 16px;
    }
    /* Metrics sections (separate items) */
    .today-panel,
    .totals-panel {
      border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-left: 16px;
      padding-right: 16px;
    }
    .today-panel {
      padding: 4px 16px 12px;
    }
    .totals-panel {
      padding: 12px 16px 0;
    }
    .right-divider {
      display: none;
    }
    .forecast-panel {
      border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-left: 16px;
      display: grid;
      align-content: start;
      align-self: stretch;
    }

    .content {
      display: grid;
      gap: 10px;
    }

    .metric .label {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    /* Left panel labels keep icon inline */
    .overview-panel .metric .label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 1.2rem;
      padding-bottom: 4px;
    }
    .overview-panel .metric .label ha-icon {
      color: var(--secondary-text-color);
      width: 28px;
      height: 28px;
      --mdc-icon-size: 28px;
    }
    .overview-panel .metric .value {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Top row icons on the left, spanning two text rows */
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

    .image {
      width: 30%;
      max-width: 180px;
      min-width: 140px;
      justify-self: end;
    }

    .image > img,
    .image > svg {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }

    .energy-section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 12px;
    }
    .grid-kwh-section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 8px;
    }
    .graphs-section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 8px;
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    /* Devices row */
    .devices-row {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 12px;
    }
    .devices-row .badges {
      display: flex;
      gap: 8px;
      align-items: stretch;
      width: 100%;
      cursor: pointer;
    }
    .devices-row .badge {
      display: grid;
      grid-template-columns: auto 1fr auto; /* icon | name | value */
      align-items: center;
      gap: 8px;
      background: var(--chip-background-color, rgba(0, 0, 0, 0.03));
      color: var(--primary-text-color);
      padding: 6px 10px;
      border-radius: 16px;
      border: 1px solid transparent;
      white-space: nowrap;
      width: 100%;
      min-width: 0; /* allow inner ellipsis */
      overflow: hidden; /* prevent overlap when space is tight */
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease;
    }
    .devices-row .badge:hover {
      background: rgba(var(--rgb-primary-color), 0.08);
      border-color: var(--primary-color);
    }
    .devices-row .badge ha-icon {
      color: var(--secondary-text-color);
    }
    .devices-row .badge .name {
      max-width: 14ch;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .devices-row .badge .value {
      font-weight: 600;
      justify-self: end;
      text-align: right;
    }

    /* Forecast mini panel */
    .forecast {
      border: 0;
      border-radius: 10px;
      padding: 12px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      align-items: center;
      max-width: 320px;
      justify-self: end;
    }
    .forecast .title {
      font-weight: 700;
    }
    .forecast .subtle {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .forecast .temp {
      font-weight: 800;
      font-size: 1.8rem;
    }
    .forecast .icon ha-icon {
      width: 40px;
      height: 40px;
      --mdc-icon-size: 40px;
    }

    /* Grids for top/bottom sections */
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

    /* Stack sections on narrower screens */
    @container (max-width: 1200px) {
      .container,
      .container.has-forecast {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .overview-panel {
        padding-right: 0;
        padding-bottom: 12px;
        display: flex;
        gap: 12px;
        align-items: start;
      }
      .forecast-panel {
        display: flex;
      }
      .metrics-panel {
        min-width: calc(100% - 320px);
      }
      .forecast {
        justify-self: stretch;
        max-width: none;
      }
      .image {
        width: clamp(100px, 28cqi, 150px);
        max-width: 150px;
        justify-self: end;
      }
      .metrics-grid {
        border-left: none;
        grid-template-columns: repeat(var(--metrics-cols, 4), minmax(0, 1fr));
        min-width: 0;
      }
      .today-panel, .totals-panel {
        padding-left: 0;
      }

      .today-panel .metric,
      .totals-panel .metric {
        min-width: 0;
      }
    }

    @container (max-width: 900px) {
      .metrics-panel {
        min-width: calc(100% - 215px);
      }
      .devices-row .badges {
        flex-wrap: wrap;
        justify-content: center;
      }
      .devices-row .badge {
        max-width: 40%;
      }
      /* Tighten big numbers and reduce columns to avoid overlap */
      .metric .value {
        font-size: 1.6rem;
      }
      .metric .value.smaller {
        font-size: 1.2rem;
      }
      .metrics-grid {
        grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr));
      }
      .overview-panel {
        grid-template-columns: 1fr auto;
      }
      .image {
        width: clamp(90px, 26cqi, 130px);
        max-width: 130px;
      }
    }

    @container (max-width: 700px) {
      .overview-panel .content {
        order: 1;
      }
      .forecast-panel {
        order: 3;
        width: 100%;
        border-left: none;
        padding-left: 0;
        padding-top: 12px;
      }
      .metrics-panel {
        min-width: 100%;
      }
      .forecast {
        padding: 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
      .overview-panel .image {
        order: 2;
        justify-self: start;
        width: clamp(80px, 40cqi, 120px);
        max-width: 120px;
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
      .overview-panel {
        grid-template-columns: 1fr auto;
      }
      .metrics-panel {
        width: 100%;
      }
      .image {
        width: clamp(90px, 32cqi, 130px);
        max-width: 130px;
      }
      /* Right panel: clamp to max 2 columns */
      .metrics-grid {
        grid-template-columns: repeat(min(var(--metrics-cols, 4), 2), minmax(0, 1fr));
        min-width: 0;
      }
    }

    @container (max-width: 350px) {
      .image > svg {
        width: 80%;
      }
    }
  `;

  // Type fields for TS
  private _hass: Hass | null;
  private _config: SolarCardConfig;
  private _gridTodayCache: {
    key: string | null;
    dateKey: string | null;
    result: DisplayValue | null;
    inflight: boolean;
  };
  private _yieldTodayCache: {
    key: string | null;
    dateKey: string | null;
    result: DisplayValue | null;
    inflight: boolean;
  };
  private _energyFlowEl: HTMLElement | null;
  private _gridKwhEl: HTMLElement | null; // legacy single graph
  private _trendGraphEls: HTMLElement[] | null;
  private _trendGraphsSig: string | null;
  private _deviceBadges: DeviceBadgeItem[];
  private _devicesRefreshing: boolean;
  private _devicesLastFetch: number;
  private _devicesTimer: ReturnType<typeof setTimeout> | null;
  private _entityRegistry: EntityRegistryEntry[] | null;
  private _deviceRegistry: DeviceRegistryEntry[] | null;
  private _devicePowerMap: Record<string, string[]> | null;
  private _deviceList: EnergyPreferences['device_consumption'];
  private _deviceIconById: Record<string, string> | null;
  private _entityRegistryByEntityId: Record<string, EntityRegistryEntry> | null;
  private _statToDeviceId?: Record<string, string> | null;
  private _deviceEntitiesMap?: Record<string, string[]> | null;
  private _lastLang?: string | null;

  constructor() {
    super();
    /** @type {any} */
    this._config = { type: 'custom:solar-card' } as SolarCardConfig;
    this._hass = null;
    // Cache for derived daily values computed from totals
    this._gridTodayCache = { key: null, dateKey: null, result: null, inflight: false };
    this._yieldTodayCache = { key: null, dateKey: null, result: null, inflight: false };
    this._energyFlowEl = null;
    this._gridKwhEl = null;
    this._trendGraphEls = null;
    this._trendGraphsSig = null;
    this._deviceBadges = [];
    this._devicesRefreshing = false;
    this._devicesLastFetch = 0;
    this._devicesTimer = null;
    this._entityRegistry = null;
    this._deviceRegistry = null;
    this._devicePowerMap = null; // stat_consumption -> [power_entity_ids]
    this._deviceList = [];
    this._deviceIconById = null; // device_id -> icon (from device registry)
    this._entityRegistryByEntityId = null; // entity_id -> entity_registry entry
    this._lastLang = null;
  }

  setConfig(config: SolarCardConfig) {
    const merged = {
      // Backward compat: accept old `yield_today_entity` as production
      production_entity: config.production_entity ?? config.yield_today_entity ?? '',
      current_consumption_entity: config.current_consumption_entity ?? '',
      image_url: config.image_url ?? '',
      show_energy_flow: config.show_energy_flow ?? false,
      show_top_devices: config.show_top_devices ?? false,
      top_devices_max: Math.min(Math.max(parseInt(String(config.top_devices_max ?? 4), 10) || 4, 1), 8),
      // Optional forecast section
      show_solar_forecast: config.show_solar_forecast ?? false,
      weather_entity: config.weather_entity ?? '',
      solar_forecast_today_entity: config.solar_forecast_today_entity ?? '',
      trend_graph_entities: Array.isArray((config as any).trend_graph_entities)
        ? ((config as any).trend_graph_entities as string[])
        : [],
      // Right section - top (today)
      yield_today_entity: config.yield_today_entity ?? '',
      grid_consumption_today_entity: config.grid_consumption_today_entity ?? '',
      battery_percentage_entity: config.battery_percentage_entity ?? '',
      inverter_state_entity: config.inverter_state_entity ?? '',
      // Right section - bottom (totals & settings)
      total_yield_entity: config.total_yield_entity ?? '',
      total_grid_consumption_entity: config.total_grid_consumption_entity ?? '',
      battery_capacity_entity: config.battery_capacity_entity ?? '',
      inverter_mode_entity: config.inverter_mode_entity ?? '',
      ...config,
    };
    // Require core overview fields
    if (!merged.production_entity || !merged.current_consumption_entity) {
      throw new Error('Solar Card: production_entity and current_consumption_entity are required.');
    }
    this._config = merged;
    this.requestUpdate();
  }

  // Lovelace UI editor needs a static getter
  static getConfigElement() {
    return document.createElement('solar-card-editor');
  }

  static buildCandidateLists(
    hass?: Hass,
    entities?: string[],
    entitiesFallback?: string[],
  ): { power: string[]; fallback: string[] } {
    const power: string[] = [];
    const fallback: string[] = [];
    const seen = new Set<string>();
    const push = (collection: string[], entityId: string) => {
      if (!entityId || seen.has(entityId)) return;
      collection.push(entityId);
      seen.add(entityId);
    };

    const consider = (entityId: string) => {
      if (!entityId) return;
      const state = hass?.states?.[entityId];
      const target = state?.attributes?.device_class === 'power' ? power : fallback;
      push(target, entityId);
    };

    for (const list of [entities, entitiesFallback]) {
      if (!Array.isArray(list)) continue;
      for (const entityId of list) consider(entityId);
    }

    if (hass) {
      const states = Object.values(hass.states || {});
      for (const state of states) {
        const entityId = state.entity_id;
        const isSensor = entityId.startsWith('sensor.');
        if (!isSensor) continue;
        const target = state.attributes?.device_class === 'power' ? power : fallback;
        push(target, entityId);
      }
    }

    return { power, fallback };
  }

  
  static getStubConfig(hass?: Hass, entities?: string[], entitiesFallback?: string[]) {
    const { power, fallback } = this.buildCandidateLists(hass, entities, entitiesFallback);
    const defaultProduction = power[0] || fallback[0] || 'sensor.solar_card_stub_production';
    const defaultConsumption = power[1] || power[0] || fallback[1] || fallback[0] || 'sensor.solar_card_stub_consumption';

    return {
      type: 'custom:solar-card',
      production_entity: defaultProduction,
      current_consumption_entity: defaultConsumption,
      image_url: '',
      show_energy_flow: false,
      show_top_devices: false,
      top_devices_max: 4,
      show_solar_forecast: false,
      weather_entity: '',
      solar_forecast_today_entity: '',
      trend_graph_entities: [],
      yield_today_entity: '',
      grid_consumption_today_entity: '',
      battery_percentage_entity: '',
      inverter_state_entity: '',
      total_yield_entity: '',
      total_grid_consumption_entity: '',
      battery_capacity_entity: '',
      inverter_mode_entity: '',
    }
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
    add(cfg.yield_today_entity);
    add(cfg.grid_consumption_today_entity);
    add(cfg.battery_percentage_entity);
    add(cfg.inverter_state_entity);
    add(cfg.total_yield_entity);
    add(cfg.total_grid_consumption_entity);
    add(cfg.battery_capacity_entity);
    add(cfg.inverter_mode_entity);
    add(cfg.weather_entity);
    add(cfg.solar_forecast_today_entity);
    if (Array.isArray((cfg as any).trend_graph_entities)) {
      for (const e of (cfg as any).trend_graph_entities) add(e);
    }
    if (cfg.show_top_devices && this._devicePowerMap) {
      for (const statId of Object.keys(this._devicePowerMap)) {
        const ents = this._devicePowerMap[statId] || [];
        for (const e of ents) watched.add(e);
      }
    }

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
    if (cfg.show_top_devices) this._maybeRefreshTopDevices();
    if (changed) this.requestUpdate();
  }

  get hass(): Hass | null {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._config?.show_top_devices) this._maybeRefreshTopDevices();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._devicesTimer) {
      clearTimeout(this._devicesTimer);
      this._devicesTimer = null;
    }
  }

  _defaultPanelsSvgHtml() {
    const rows = Array.from({ length: 3 });
    const cols = Array.from({ length: 6 });
    // Use `svg` template for nested SVG nodes to ensure correct namespace
    const cells = rows.flatMap((_r, r) =>
      cols.map(
        (_c, c) =>
          svg`<rect x="${8 + c * 31}" y="${8 + r * 36}" width="28" height="28" rx="3" fill="rgba(255,255,255,0.25)" />`,
      ),
    );
    return html`
      <svg viewBox="0 0 240 200" part="image" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2d6cdf" />
            <stop offset="100%" stop-color="#0d3fa6" />
          </linearGradient>
        </defs>
        <g transform="translate(20,20)">
          <rect x="0" y="0" width="200" height="120" rx="6" fill="url(#g1)" />
          ${cells}
          <rect x="0" y="0" width="200" height="120" rx="6" fill="none" stroke="rgba(255,255,255,0.6)" />
        </g>
        <rect x="40" y="150" width="160" height="10" rx="5" fill="#8892a0" opacity="0.7" />
      </svg>
    `;
  }

  render() {
    const hass = this._hass;
    const cfg = this._config || {};
    const overview = this._computeOverviewValues(cfg);
    const today = this._computeTodayPanelValues(cfg);
    const totals = this._computeTotalsPanelValues(cfg);
    const forecast = this._computeForecastValues(cfg);
    const devicesList = cfg.show_top_devices ? this._computeTopDevicesLive(cfg.top_devices_max || 4) : [];

    // Compose tile configs to render (full tile passthrough + trend graphs + legacy single)
    const tiles: any[] = [];
    const rawTiles = Array.isArray((cfg as any).feature_tiles) ? ((cfg as any).feature_tiles as any[]) : [];
    for (const t of rawTiles) {
      if (t && typeof t === 'object') tiles.push({ type: 'tile', ...t });
    }
    const graphEntities: string[] = [];
    const list = Array.isArray((cfg as any).trend_graph_entities)
      ? (cfg as any).trend_graph_entities.filter((s: string) => typeof s === 'string' && s.includes('.'))
      : [];
    graphEntities.push(...list);
    const defHours0 = Number((cfg as any)?.trend_graph_hours_to_show) || 24;
    const defDetail0 = Number((cfg as any)?.trend_graph_detail) || 2;
    for (const entityId of graphEntities) {
      tiles.push({
        type: 'tile',
        entity: entityId,
        features: [ { type: 'trend-graph', hours_to_show: defHours0, detail: defDetail0 } ],
      });
    }

    return html`
      <ha-card>
        <div class="container${cfg.show_solar_forecast ? ' has-forecast' : ''}">
          ${this._renderOverviewPanel(overview.production, overview.consumption, overview.image_url)}
          <div class="metrics-panel">
            ${this._renderTodayPanel(cfg, today)} ${this._renderTotalsPanel(cfg, totals)}
          </div>
          ${cfg.show_solar_forecast ? this._renderForecastPanel(forecast) : nothing}
        </div>

        ${cfg.show_top_devices && devicesList.length ? this._renderDevicesRow(devicesList) : nothing}
        ${tiles.length
          ? html`<div id="graphs-section" class="graphs-section"></div>`
          : nothing}
        ${cfg.show_energy_flow
          ? html`<div id="energy-section" class="energy-section"><div id="energy-flow"></div></div>`
          : nothing}
      </ha-card>
    `;
  }

  private _computeOverviewValues(cfg: SolarCardConfig) {
    const hass = this._hass;
    return {
      production: entityDisplay(hass, cfg.production_entity),
      consumption: entityDisplay(hass, cfg.current_consumption_entity),
      image_url: cfg.image_url || '',
    };
  }

  private _computeTodayPanelValues(cfg: SolarCardConfig) {
    const hass = this._hass;
    let yieldToday = entityDisplay(hass, cfg.yield_today_entity);
    let gridToday = entityDisplay(hass, cfg.grid_consumption_today_entity);
    if ((!cfg.grid_consumption_today_entity || gridToday.value === '—') && cfg.total_grid_consumption_entity) {
      const derived = this._ensureGridTodayFromTotal(cfg.total_grid_consumption_entity);
      gridToday = derived || {
        value: '…',
        unit: hass?.states?.[cfg.total_grid_consumption_entity]?.attributes?.unit_of_measurement || '',
      };
    }
    if ((!cfg.yield_today_entity || yieldToday.value === '—') && cfg.total_yield_entity) {
      const derivedY = this._ensureYieldTodayFromTotal(cfg.total_yield_entity);
      yieldToday = derivedY || {
        value: '…',
        unit: hass?.states?.[cfg.total_yield_entity]?.attributes?.unit_of_measurement || '',
      };
    }
    return {
      yieldToday,
      gridToday,
      batteryPct: entityDisplay(hass, cfg.battery_percentage_entity),
      inverterState: entityDisplay(hass, cfg.inverter_state_entity),
    };
  }

  private _computeTotalsPanelValues(cfg: SolarCardConfig) {
    const hass = this._hass;
    return {
      totalYield: entityDisplay(hass, cfg.total_yield_entity),
      totalGrid: entityDisplay(hass, cfg.total_grid_consumption_entity),
      batteryCapacity: entityDisplay(hass, cfg.battery_capacity_entity),
      inverterModeDisplay: entityDisplay(hass, cfg.inverter_mode_entity),
    };
  }

  private _computeForecastValues(cfg: SolarCardConfig) {
    const hass = this._hass;
    const weather = this._weatherDisplay(hass, cfg.weather_entity);
    const solarForecastToday = entityDisplay(hass, cfg.solar_forecast_today_entity);
    const hasWeather = !!cfg.weather_entity;
    const hasSolarForecast = !!cfg.solar_forecast_today_entity;
    const showSolarPrimary = hasSolarForecast || !hasWeather;
    return {
      title: hasWeather ? localize('card.weather_today') : localize('card.solar_forecast'),
      icon: hasWeather ? weather.icon || 'mdi:weather-partly-cloudy' : 'mdi:white-balance-sunny',
      majorValue: showSolarPrimary
        ? `${solarForecastToday.value}`
        : `${weather.temperature != null ? weather.temperature : '—'}`,
      majorUnit: showSolarPrimary ? `${solarForecastToday.unit}` : `${weather.unit || ''}`,
      minor: showSolarPrimary ? localize('card.expected_forecast') : weather.condition || '',
    };
  }

  private _renderOverviewPanel(production: DisplayValue, consumption: DisplayValue, image_url: string) {
    return html` <div class="overview-panel">
      <div class="content">
        <div class="metric">
          <div class="label"><ha-icon icon="mdi:solar-panel"></ha-icon> ${localize('card.production')}</div>
          <div class="value">${production.value} ${production.unit}</div>
        </div>
        <div class="metric">
          <div class="label"><ha-icon icon="mdi:power-socket-eu"></ha-icon> ${localize('card.consumption')}</div>
          <div class="value smaller">${consumption.value} ${consumption.unit}</div>
        </div>
      </div>
      <div class="image">
        ${image_url ? html`<img src="${image_url}" alt="Solar panels" loading="lazy" />` : this._defaultPanelsSvgHtml()}
      </div>
    </div>`;
  }

  private _renderTodayPanel(
    cfg: SolarCardConfig,
    today: {
      yieldToday: DisplayValue;
      gridToday: DisplayValue;
      batteryPct: DisplayValue;
      inverterState: DisplayValue;
    },
  ) {
    const showYield = !!(cfg.yield_today_entity || cfg.total_yield_entity);
    const showGrid = !!(cfg.grid_consumption_today_entity || cfg.total_grid_consumption_entity);
    const showBattery = !!cfg.battery_percentage_entity;
    const showInverter = !!cfg.inverter_state_entity;
    const items: unknown[] = [];
    if (showYield) {
      items.push(
        html`<div class="metric metric-top">
          <ha-icon class="icon" icon="mdi:solar-power-variant"></ha-icon>
          <div class="label">${localize('card.yield_today')}</div>
          <div class="value smaller">${today.yieldToday.value} ${today.yieldToday.unit}</div>
        </div>`,
      );
    }
    if (showGrid) {
      items.push(
        html`<div class="metric metric-top">
          <ha-icon class="icon" icon="mdi:transmission-tower"></ha-icon>
          <div class="label">${localize('card.grid_today')}</div>
          <div class="value smaller">${today.gridToday.value} ${today.gridToday.unit}</div>
        </div>`,
      );
    }
    if (showBattery) {
      items.push(
        html`<div class="metric metric-top">
          <ha-icon class="icon" icon="mdi:battery"></ha-icon>
          <div class="label">${localize('card.battery')}</div>
          <div class="value smaller">${today.batteryPct.value} ${today.batteryPct.unit || '%'}</div>
        </div>`,
      );
    }
    if (showInverter) {
      items.push(
        html`<div class="metric metric-top">
          <ha-icon class="icon" icon="mdi:power"></ha-icon>
          <div class="label">${localize('card.inverter_state')}</div>
          <div class="value smaller">${today.inverterState.value}</div>
        </div>`,
      );
    }
    if (!items.length) return nothing;
    return html` <div class="today-panel metrics-grid" style="--metrics-cols: ${items.length}">${items}</div>`;
  }

  private _renderTotalsPanel(
    cfg: SolarCardConfig,
    totals: {
      totalYield: DisplayValue;
      totalGrid: DisplayValue;
      batteryCapacity: DisplayValue;
      inverterModeDisplay: DisplayValue;
    },
  ) {
    const items: unknown[] = [];
    if (cfg.total_yield_entity) {
      items.push(
        html`<div class="metric metric-bottom">
          <div class="label">${localize('card.total_yield')}</div>
          <div class="value smaller">${totals.totalYield.value} ${totals.totalYield.unit}</div>
        </div>`,
      );
    }
    if (cfg.total_grid_consumption_entity) {
      items.push(
        html`<div class="metric metric-bottom">
          <div class="label">${localize('card.grid_consumption')}</div>
          <div class="value smaller">${totals.totalGrid.value} ${totals.totalGrid.unit}</div>
        </div>`,
      );
    }
    if (cfg.battery_capacity_entity) {
      items.push(
        html`<div class="metric metric-bottom">
          <div class="label">${localize('card.battery_capacity')}</div>
          <div class="value smaller">${totals.batteryCapacity.value} ${totals.batteryCapacity.unit}</div>
        </div>`,
      );
    }
    if (cfg.inverter_mode_entity) {
      items.push(
        html`<div class="metric metric-bottom">
          <div class="label">${localize('card.inverter_mode')}</div>
          <div class="value smaller">${totals.inverterModeDisplay.value}</div>
        </div>`,
      );
    }
    if (!items.length) return nothing;
    return html` <div class="totals-panel metrics-grid" style="--metrics-cols: ${items.length}">${items}</div>`;
  }

  private _renderForecastPanel(forecast: {
    title: string;
    icon: string;
    majorValue: string;
    majorUnit: string;
    minor: string;
  }) {
    return html` <div class="forecast-panel">
      <div class="forecast" id="forecast">
        <div>
          <div class="title">${forecast.title}</div>
          <div class="subtle">${this._formatTodayDate()}</div>
          <div class="temp">${forecast.majorValue} ${forecast.majorUnit}</div>
          <div class="subtle">${forecast.minor}</div>
        </div>
        <div class="icon">
          <ha-icon icon="${forecast.icon}"></ha-icon>
        </div>
      </div>
    </div>`;
  }

  private _renderDevicesRow(devicesList: DeviceBadgeItem[]) {
    return html` <div class="devices-row" id="devices-row" @click=${this._onDevicesClick}>
      <div class="badges">
        ${devicesList.map(
          (it) =>
            html`<div class="badge" role="listitem" data-stat-id="${it.id}">
              <ha-icon icon="${it.icon || 'mdi:power-plug'}"></ha-icon>
              <span class="name">${it.name}</span>
              <span class="value">${formatNumberLocale(it.watts, this._hass, { maximumFractionDigits: 0 })} W</span>
            </div>`,
        )}
      </div>
    </div>`;
  }

  updated() {
    if (this._config?.show_energy_flow) {
      this._renderEnergyFlow();
    }
    const cfg = this._config;
    const tiles: any[] = [];
    const rawTiles = Array.isArray((cfg as any)?.feature_tiles) ? ((cfg as any).feature_tiles as any[]) : [];
    for (const t of rawTiles) {
      if (t && typeof t === 'object') tiles.push({ type: 'tile', ...t });
    }
    const ents = Array.isArray((cfg as any)?.trend_graph_entities) ? ((cfg as any).trend_graph_entities as string[]) : [];
    const merged = new Set<string>(ents);
    const defHours = Number((cfg as any)?.trend_graph_hours_to_show) || 24;
    for (const entityId of Array.from(merged)) {
      tiles.push({ type: 'tile', entity: entityId, features: [ { type: 'trend-graph', hours_to_show: defHours } ] });
    }
    if (tiles.length) this._renderTrendGraphs(tiles);
  }

  _onDevicesClick = (ev: Event) => {
    const target = ev.composedPath
      ? (ev.composedPath() as EventTarget[]).find((n) => (n as HTMLElement)?.classList?.contains?.('badge'))
      : (ev.target as HTMLElement).closest?.('.badge');
    const statId = (target as HTMLElement | undefined)?.getAttribute?.('data-stat-id');
    if (statId) this._openBadgeDevice(statId);
  };

  async _maybeRefreshTopDevices() {
    const now = Date.now();
    if (!this._hass) return;
    if (this._devicesRefreshing) return;
    if (now - this._devicesLastFetch < 60 * 1000) return; // throttle mapping to once a minute
    this._devicesRefreshing = true;
    try {
      // Refresh Energy preferences + build power entity map for live updates
      const prefs = await this._hass!.callWS<EnergyPreferences>({ type: 'energy/get_prefs' });
      this._deviceList = Array.isArray(prefs?.device_consumption) ? prefs.device_consumption : [];
      await this._ensureDevicePowerMap();
      this._devicesLastFetch = Date.now();
      this.requestUpdate();
    } catch (_e) {
      // ignore
    } finally {
      this._devicesRefreshing = false;
      // schedule next mapping refresh
      if (this._devicesTimer) clearTimeout(this._devicesTimer);
      if (this._config?.show_top_devices) {
        this._devicesTimer = setTimeout(() => {
          // force refresh ignoring throttle
          this._devicesLastFetch = 0;
          this._maybeRefreshTopDevices();
        }, 60000);
      }
    }
  }

  async _ensureDevicePowerMap() {
    if (!this._hass) return;
    if (!this._entityRegistry) {
      this._entityRegistry = await this._hass!.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
    }
    if (!this._deviceRegistry) {
      try {
        this._deviceRegistry = await this._hass!.callWS<DeviceRegistryEntry[]>({ type: 'config/device_registry/list' });
      } catch (_e) {
        this._deviceRegistry = [];
      }
    }
    const reg = this._entityRegistry || [];
    const dreg = this._deviceRegistry || [];
    // Build quick lookup maps
    const entityRegById: Record<string, EntityRegistryEntry> = {};
    for (const ent of reg) {
      if (ent?.entity_id) entityRegById[ent.entity_id] = ent;
    }
    const deviceIconById: Record<string, string> = {};
    for (const dev of dreg) {
      if (dev?.id && dev?.icon) deviceIconById[dev.id] = dev.icon;
    }
    const byDevice = {};
    for (const ent of reg) {
      // Map ALL entity ids for each device for icon heuristics
      if (!ent.entity_id) continue;
      if (!ent.device_id) continue;
      (byDevice[ent.device_id] = byDevice[ent.device_id] || []).push(ent.entity_id);
    }
    const map = {};
    const statToDevice = {};
    const deviceEntities = {};
    const states = this._hass.states || {};
    for (const dev of this._deviceList ?? []) {
      const statId = dev.stat_consumption;
      if (!statId || !statId.includes('.')) continue;
      const entry = reg.find((e) => e.entity_id === statId);
      const deviceId = entry?.device_id;
      if (!deviceId) continue;
      const candidates = (byDevice[deviceId] || []).filter((eid) => {
        const st = states[eid];
        const dc = st?.attributes?.device_class;
        const unit = st?.attributes?.unit_of_measurement || '';
        return dc === 'power' && /k?W/i.test(unit);
      });
      if (candidates.length) map[statId] = candidates;
      statToDevice[statId] = deviceId;
      deviceEntities[deviceId] = byDevice[deviceId] || [];
    }
    this._devicePowerMap = map;
    this._statToDeviceId = statToDevice;
    this._deviceEntitiesMap = deviceEntities;
    this._deviceIconById = deviceIconById;
    this._entityRegistryByEntityId = entityRegById;
  }

  _powerWattsFromState(entityId: string): number | null {
    const st = this._hass?.states?.[entityId];
    if (!st) return null;
    const raw = Number(st.state);
    if (!isFinite(raw)) return null;
    const unit = (st.attributes?.unit_of_measurement || '').toLowerCase();
    let watts = raw;
    if (unit.includes('kw')) watts = raw * 1000;
    // assume already in W otherwise
    if (!isFinite(watts)) return null;
    return watts;
  }

  _iconForEntity(entityId: string): string {
    const st = this._hass?.states?.[entityId];
    if (!st) return 'mdi:power-plug';
    const icon = st.attributes?.icon;
    if (icon) return icon;
    const domain = entityId.split('.')[0];
    const dc = st.attributes?.device_class;
    if (domain === 'light') return 'mdi:lightbulb';
    if (domain === 'switch') return 'mdi:power-plug';
    if (domain === 'fan') return 'mdi:fan';
    if (domain === 'climate') return 'mdi:thermostat';
    if (domain === 'sensor' && dc === 'power') return 'mdi:flash';
    if (domain === 'sensor' && dc === 'energy') return 'mdi:lightning-bolt';
    return 'mdi:power-plug';
  }

  _iconForDeviceByStat(statId: string): string {
    const deviceId = this._statToDeviceId?.[statId];
    if (!deviceId) return 'mdi:power-plug';
    // 0) Prefer device registry icon configured in the UI
    const devIcon = this._deviceIconById?.[deviceId];
    if (devIcon) return devIcon;
    const entities = this._deviceEntitiesMap?.[deviceId] || [];
    if (!entities.length) return 'mdi:power-plug';
    const states = this._hass?.states || {};
    const regById = this._entityRegistryByEntityId || {};
    // Prefer specific domains representative of a device
    const domainPreference = [
      'light',
      'switch',
      'climate',
      'fan',
      'vacuum',
      'media_player',
      'water_heater',
      'humidifier',
      'cover',
    ];
    // 1) Use first entity with explicit icon in entity registry (prefer domains)
    for (const dom of domainPreference) {
      const eid = entities.find((e) => e.startsWith(dom + '.'));
      const er = eid ? regById[eid] : undefined;
      if (er?.icon) return er.icon;
    }
    for (const eid of entities) {
      const er = regById[eid];
      if (er?.icon) return er.icon;
    }
    // 2) Use runtime state icon if set (prefer domains)
    for (const dom of domainPreference) {
      const eid = entities.find((e) => e.startsWith(dom + '.'));
      const st = eid ? states[eid] : undefined;
      if (st?.attributes?.icon) return st.attributes.icon;
    }
    for (const eid of entities) {
      const st = states[eid];
      if (st?.attributes?.icon) return st.attributes.icon;
    }
    // 3) Heuristic fallback by domain
    for (const dom of domainPreference) {
      const eid = entities.find((e) => e.startsWith(dom + '.'));
      if (eid) return this._iconForEntity(eid);
    }
    // 4) Any entity we can derive an icon from
    for (const eid of entities) {
      if (states[eid]) return this._iconForEntity(eid);
    }
    return 'mdi:power-plug';
  }

  _computeTopDevicesLive(maxCount: number): DeviceBadgeItem[] {
    if (!this._devicePowerMap || !this._deviceList?.length) return [];
    const items: DeviceBadgeItem[] = [];
    for (const dev of this._deviceList) {
      const statId = dev.stat_consumption;
      const namestr = dev.name || statId;
      const pEntities = this._devicePowerMap[statId] || [];
      let watts: number | null = null;
      let bestEntity: string | null = null;
      for (const pe of pEntities) {
        const val = this._powerWattsFromState(pe);
        if (val == null) continue;
        if (watts == null || val > watts) {
          watts = Math.max(0, val);
          bestEntity = pe;
        }
      }
      if (watts != null && watts > 0) {
        const icon = this._iconForDeviceByStat(statId);
        items.push({ id: statId, name: namestr, watts, icon });
      }
    }
    items.sort((a, b) => b.watts - a.watts);
    return items.slice(0, maxCount);
  }

  async _fetchTopConsumptionDevices(maxCount: number): Promise<DeviceBadgeItem[]> {
    // Pull devices from Energy preferences and compute recent power from energy deltas
    const prefs = await this._hass!.callWS<EnergyPreferences>({ type: 'energy/get_prefs' });
    const devices = Array.isArray(prefs?.device_consumption) ? prefs.device_consumption : [];
    const statIds = devices.map((d) => d.stat_consumption).filter((s) => !!s);
    if (!statIds.length) return [];
    const end = new Date();
    const start = new Date(end.getTime() - 60 * 60 * 1000); // last 60 minutes
    const stats = await this._hass!.callWS<StatisticsDuringPeriod>({
      type: 'recorder/statistics_during_period',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      statistic_ids: statIds,
      period: '5minute',
    });
    const byId: StatisticsDuringPeriod = (stats as StatisticsDuringPeriod) || {};
    const items: DeviceBadgeItem[] = [];
    for (const dev of devices) {
      const sid = dev.stat_consumption;
      const series = byId?.[sid];
      if (!Array.isArray(series) || series.length < 2) continue;
      // find last two points with numeric sum
      let i = series.length - 1;
      while (i >= 0 && (series[i].sum == null || isNaN(Number(series[i].sum)))) i--;
      if (i <= 0) continue;
      let j = i - 1;
      while (j >= 0 && (series[j].sum == null || isNaN(Number(series[j].sum)))) j--;
      if (j < 0) continue;
      const last = series[i];
      const prev = series[j];
      const dtHours = (new Date(last.start).getTime() - new Date(prev.start).getTime()) / 3600000;
      if (dtHours <= 0) continue;
      const deltaKWh = Math.max(0, (last.sum ?? 0) - (prev.sum ?? 0));
      const watts = (deltaKWh / dtHours) * 1000; // approximate instantaneous power
      if (!isFinite(watts)) continue;
      items.push({
        id: sid,
        name: dev.name || sid,
        watts,
      });
    }
    items.sort((a, b) => b.watts - a.watts);
    const top = items.slice(0, maxCount);
    return top;
  }

  _renderTopDevicesRow() {
    const max = this._config?.top_devices_max || 4;
    // Only show devices currently consuming power (instantaneous)
    const list = this._computeTopDevicesLive(max);
    let section = this.shadowRoot?.getElementById('devices-row');
    if (!list.length) {
      if (section) section.remove();
      this._deviceBadges = [];
      return;
    }
    const columns = Math.max(1, list.length);
    if (!section) {
      // create section structure once
      section = document.createElement('div');
      section.innerHTML = `
        <div class="devices-row" id="devices-row">
          <div class="devices-divider"></div>
          <div class="badges" role="list" style="--dev-cols: ${columns};"></div>
        </div>`;
      const card = this.shadowRoot?.querySelector('ha-card');
      const energySection = this.shadowRoot?.getElementById('energy-section');
      if (card) {
        if (energySection && section.firstElementChild) {
          card.insertBefore(section.firstElementChild, energySection);
        } else if (section.firstElementChild) {
          card.appendChild(section.firstElementChild);
        }
      }
      section = this.shadowRoot?.getElementById('devices-row');
    }

    // Update badges incrementally when layout is unchanged
    const row = this.shadowRoot?.getElementById('devices-row');
    const badges = row?.querySelector('.badges');
    const prevIds = Array.isArray(this._deviceBadges) ? this._deviceBadges.map((d) => d.id) : [];
    const newIds = list.map((d) => d.id);
    const sameLayout = prevIds.length === newIds.length && prevIds.every((v, i) => v === newIds[i]);
    if (badges && sameLayout) {
      // Update values only to preserve DOM (prevents hover flicker)
      for (const it of list) {
        const badge = badges.querySelector(`.badge[data-stat-id="${it.id}"]`);
        if (!badge) continue;
        const valEl = badge.querySelector('.value');
        if (valEl) {
          const newText = `${formatNumberLocale(it.watts, this._hass, { maximumFractionDigits: 0 })} W`;
          if (valEl.textContent !== newText) valEl.textContent = newText;
        }
        // Avoid changing icon/name to keep DOM stable; they rarely change
      }
    } else {
      // Rebuild badges content when the set/order of devices changes
      const htmlBadges = list
        .map(
          (it) => `
            <div class="badge" role="listitem" data-stat-id="${escapeHtml(it.id)}">
              <ha-icon icon="${escapeHtml(it.icon || 'mdi:power-plug')}"></ha-icon>
              <span class="name">${escapeHtml(it.name)}</span>
              <span class="value">${escapeHtml(formatNumberLocale(it.watts, this._hass, { maximumFractionDigits: 0 }))} W</span>
            </div>`,
        )
        .join('');
      if (badges) {
        badges.setAttribute('style', `--dev-cols: ${columns};`);
        badges.innerHTML = htmlBadges;
      }
    }
    // bind click handler once
    if (!this._boundDeviceRowClick) {
      this._boundDeviceRowClick = new WeakSet<HTMLElement>();
    }
    if (row && !this._boundDeviceRowClick.has(row)) {
      row.addEventListener('click', (ev) => {
        const target = (ev.target as HTMLElement).closest?.('.badge');
        if (!target) return;
        const statId = target.getAttribute('data-stat-id');
        if (statId) this._openBadgeDevice(statId);
      });
      this._boundDeviceRowClick.add(row);
    }

    // remember last list for diffing
    this._deviceBadges = list;
  }

  async _openBadgeDevice(statId: string) {
    // Resolve entity registry to find device for this statistic/entity
    try {
      if (!this._entityRegistry) {
        this._entityRegistry = await this._hass!.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
      }
      let entityId = statId;
      // Some stats could be like 'sensor.xxx'; if not, we can't resolve
      if (!entityId.includes('.')) {
        this._navigateToPath(`/developer-tools/statistics?statistic_id=${encodeURIComponent(statId)}`);
        return;
      }
      const entry = this._entityRegistry.find((e) => e.entity_id === entityId);
      if (entry?.device_id) {
        this._navigateToPath(`/config/devices/device/${entry.device_id}`);
        return;
      }
      // Fallback to more-info dialog for the entity
      const ev = new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true });
      this.dispatchEvent(ev);
    } catch (_e) {
      // Fallback: open statistics page
      this._navigateToPath(`/developer-tools/statistics?statistic_id=${encodeURIComponent(statId)}`);
    }
  }

  private _navigateToPath(path: string) {
    const targetPath = path.startsWith('/') ? path : `/${path}`;
    if (typeof navigate === 'function') {
      try {
        navigate(this, targetPath);
        return;
      } catch (_err) {
        // fall back to default handling
      }
    }
    window.location.assign(targetPath);
  }

  _formatTodayDate(): string {
    try {
      const d = new Date();
      const day = d.toLocaleDateString(this._hass?.locale?.language || undefined, { weekday: 'short' });
      return `${day} ${d.getDate()}/${d.getMonth() + 1}`;
    } catch (_e) {
      const d = new Date();
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  }

  _weatherDisplay(
    hass: Hass | null,
    entityId?: string | null,
  ): { temperature: string | null; unit?: string; condition?: string; icon?: string } {
    if (!entityId) return { temperature: null };
    const st = hass?.states?.[entityId];
    if (!st) return { temperature: null };
    const temp = st.attributes?.temperature;
    const unit = st.attributes?.temperature_unit || hass?.config?.unit_system?.temperature || '°C';
    const condition = st.state || '';
    const icon = this._weatherIcon(condition);
    return { temperature: temp != null ? String(temp) : null, unit, condition, icon };
  }

  _weatherIcon(cond: string): string {
    const map = {
      clear: 'mdi:weather-sunny',
      'clear-night': 'mdi:weather-night',
      cloudy: 'mdi:weather-cloudy',
      fog: 'mdi:weather-fog',
      hail: 'mdi:weather-hail',
      lightning: 'mdi:weather-lightning',
      'lightning-rainy': 'mdi:weather-lightning-rainy',
      partlycloudy: 'mdi:weather-partly-cloudy',
      pouring: 'mdi:weather-pouring',
      rainy: 'mdi:weather-rainy',
      snowy: 'mdi:weather-snowy',
      windy: 'mdi:weather-windy',
      exceptional: 'mdi:alert',
    };
    return map[cond] || 'mdi:weather-partly-cloudy';
  }

  async _renderEnergyFlow() {
    const container = this.shadowRoot?.getElementById('energy-flow') as HTMLElement | null;
    if (!container) return;
    // Reuse existing element if possible
    if (this._energyFlowEl && this._energyFlowEl.parentElement === container) {
      (this._energyFlowEl as HassAware).hass = this._hass;
      return;
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
    (el as HassAware).hass = this._hass;
    el.style.setProperty('--row-size', '6');
    container.innerHTML = '';
    container.appendChild(el);
    this._energyFlowEl = el;
  }

  async _renderTrendGraphs(tileConfigs: any[]) {
    // Ensure registries are available so we can resolve device names for stripping
    await this._ensureRegistriesForNames();
    const container = this.shadowRoot?.getElementById('graphs-section') as HTMLElement | null;
    if (!container || !tileConfigs?.length) return;
    // If the count matches, just update hass to avoid rebuilding
    if (Array.isArray(this._trendGraphEls) && this._trendGraphEls.length === tileConfigs.length) {
      for (const el of this._trendGraphEls) {
        try { (el as HassAware).hass = this._hass; } catch (_e) { /* ignore */ }
      }
      return;
    }
    container.innerHTML = '';
    this._trendGraphEls = [];
    for (const cfg of tileConfigs) {
      if (!cfg) continue;
      let el: HTMLElement | null = null;
      const ent = (cfg as any).entity as string | undefined;
      // Prefer the entity's friendly name as the tile title, unless user overrides
      let friendly = ent && this._hass?.states?.[ent]?.attributes?.friendly_name;
      const tileConfig = { type: 'tile', ...cfg } as any;
      if (!('name' in tileConfig) && friendly) tileConfig.name = this._stripDeviceFromName(String(friendly), ent);
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
      (el as HassAware).hass = this._hass;
      container.appendChild(el);
      this._trendGraphEls.push(el);
    }
  }

  private async _ensureRegistriesForNames() {
    if (!this._hass) return;
    try {
      if (!this._entityRegistry) {
        this._entityRegistry = await this._hass!.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
      }
      if (!this._deviceRegistry) {
        try {
          this._deviceRegistry = await this._hass!.callWS<DeviceRegistryEntry[]>({ type: 'config/device_registry/list' });
        } catch (_e) {
          this._deviceRegistry = [];
        }
      }
    } catch (_e) {
      // ignore; name stripping will just use fallbacks
    }
  }

  private _stripDeviceFromName(name: string, entityId?: string): string {
    const original = (name || '').trim();
    const dev = this._deviceNameForEntity(entityId || '') || '';
    if (!dev) return original;
    const esc = dev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let out = original.replace(new RegExp(esc, 'i'), '').trim();
    // remove leftover leading separators
    out = out.replace(/^[\s\-—–:|•·.]+/, '').trim();
    return out || original;
  }

  private _deviceNameForEntity(entityId: string): string | null {
    try {
      const reg = this._entityRegistry as any[] | null;
      const dreg = this._deviceRegistry as any[] | null;
      if (!entityId || !reg || !dreg) return null;
      const entry = reg.find((e: any) => e?.entity_id === entityId);
      const dev = entry?.device_id ? dreg.find((d: any) => d?.id === entry.device_id) : null;
      return dev?.name || null;
    } catch (_e) {
      return null;
    }
  }

  // Compute today's delta from a cumulative/total sensor using HA history API
  _ensureGridTodayFromTotal(entityId: string): DisplayValue | null {
    if (!this._hass || !entityId) return null;
    const dateKey = new Date().toDateString();
    if (
      this._gridTodayCache.key === entityId &&
      this._gridTodayCache.dateKey === dateKey &&
      this._gridTodayCache.result
    ) {
      return this._gridTodayCache.result;
    }
    if (!this._gridTodayCache.inflight) {
      this._gridTodayCache.inflight = true;
      this._gridTodayCache.key = entityId;
      this._gridTodayCache.dateKey = dateKey;
      this._fetchTodayDiff(entityId)
        .then((num) => {
          const unit = this._hass?.states?.[entityId]?.attributes?.unit_of_measurement || '';
          const formatted = formatNumberLocale(num, this._hass, { maximumFractionDigits: 2 });
          this._gridTodayCache.result = { value: formatted, unit };
        })
        .catch(() => {
          this._gridTodayCache.result = {
            value: '—',
            unit: this._hass?.states?.[entityId]?.attributes?.unit_of_measurement || '',
          };
        })
        .finally(() => {
          this._gridTodayCache.inflight = false;
          // Trigger re-render with the computed value
          this.requestUpdate();
        });
    }
    return null;
  }

  _ensureYieldTodayFromTotal(entityId: string): DisplayValue | null {
    if (!this._hass || !entityId) return null;
    const dateKey = new Date().toDateString();
    if (
      this._yieldTodayCache.key === entityId &&
      this._yieldTodayCache.dateKey === dateKey &&
      this._yieldTodayCache.result
    ) {
      return this._yieldTodayCache.result;
    }
    if (!this._yieldTodayCache.inflight) {
      this._yieldTodayCache.inflight = true;
      this._yieldTodayCache.key = entityId;
      this._yieldTodayCache.dateKey = dateKey;
      this._fetchTodayDiff(entityId)
        .then((num) => {
          const unit = this._hass?.states?.[entityId]?.attributes?.unit_of_measurement || '';
          const formatted = formatNumberLocale(num, this._hass, { maximumFractionDigits: 2 });
          this._yieldTodayCache.result = { value: formatted, unit };
        })
        .catch(() => {
          this._yieldTodayCache.result = {
            value: '—',
            unit: this._hass?.states?.[entityId]?.attributes?.unit_of_measurement || '',
          };
        })
        .finally(() => {
          this._yieldTodayCache.inflight = false;
          this.requestUpdate();
        });
    }
    return null;
  }

  async _fetchTodayDiff(entityId: string): Promise<number> {
    const hass = this._hass;
    if (!hass) return 0;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // local midnight
    const startIso = start.toISOString();
    const endIso = now.toISOString();
    const path = `history/period/${startIso}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${endIso}&minimal_response`;
    const resp = await hass.callApi<HistoryPeriodResponse>('GET', path);
    if (!Array.isArray(resp) || !Array.isArray(resp[0]) || !resp[0].length) return 0;
    const series = resp[0];
    const nums = series
      .map((pt) => {
        const v = Number(pt.state);
        return Number.isFinite(v) ? v : null;
      })
      .filter((v) => v !== null);
    if (!nums.length) return 0;
    const first = nums[0];
    const last = nums[nums.length - 1];
    const delta = last - first;
    return delta > 0 ? delta : 0;
  }
}

customElements.define('solar-card', HaSolarCard);