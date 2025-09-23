// Home Assistant Solar Card
// Element: solar-card

import { LitElement, html, css, nothing } from 'lit';
import { navigate } from 'custom-card-helpers';
import './components/metrics-panel';
import './components/top-devices-row';
import './components/trend-graphs';
import './components/energy-flow';
import './components/overview-panel';
import './components/forecast-panel';
import type { MetricsTodayValues, MetricsTotalsValues } from './components/metrics-panel';
import type { TopDeviceBadgeView } from './components/top-devices-row';
import type { OverviewPanelData } from './components/overview-panel';
import type { ForecastPanelData } from './components/forecast-panel';
import { localize } from './localize/localize';
import { formatNumberLocale, entityDisplay } from './utils/format';
import { weatherDisplay } from './utils/weather';
import { normalizeConfig, stubConfig } from './utils/config';
// Ensure the visual editor is registered when this module loads
import './solar-card-editor';
import type { Hass, EntityRegistryEntry, DeviceRegistryEntry, EnergyPreferences } from './types/ha';
import type { SolarCardConfig, DisplayValue, DeviceBadgeItem } from './types/solar-card-config';
import { fetchTodayDiff } from './data/history';
import {
  ensureDevicePowerMap,
  computeTopDevicesLive,
  iconForDeviceByStat,
  iconForEntity,
  stripDeviceFromName,
  type DeviceLookupState,
} from './data/top-devices';
import { renderDefaultPanelsSvg } from './svg/default-panels';
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
  static get properties() {
    return {
      _hass: { attribute: false },
      _config: { attribute: false },
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

    .metric .value {
      font-weight: 700;
      font-size: 2rem;
      line-height: 1.1;
    }

    .metric .value.smaller {
      font-size: 1.4rem;
    }

    /* Forecast mini panel */
    /* Stack sections on narrower screens */
    @container (max-width: 1200px) {
      .container,
      .container.has-forecast {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }

    @container (max-width: 900px) {
      /* Tighten big numbers and reduce columns to avoid overlap */
      .metric .value {
        font-size: 1.6rem;
      }
      .metric .value.smaller {
        font-size: 1.2rem;
      }
    }

    @container (max-width: 700px) {
      .metric .value {
        font-size: 1.5rem;
      }
      .metric .value.smaller {
        font-size: 1.1rem;
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
  private _gridKwhEl: HTMLElement | null; // legacy single graph
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
  private _trendEnsureRegistries: () => Promise<void>;
  private _trendStripName: (name: string, entityId?: string) => string;

  constructor() {
    super();
    /** @type {any} */
    this._config = { type: 'solar-card' } as SolarCardConfig;
    this._hass = null;
    // Cache for derived daily values computed from totals
    this._gridTodayCache = { key: null, dateKey: null, result: null, inflight: false };
    this._yieldTodayCache = { key: null, dateKey: null, result: null, inflight: false };
    this._gridKwhEl = null;
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
    this._trendEnsureRegistries = this._ensureRegistriesForNames.bind(this);
    this._trendStripName = this._stripDeviceFromName.bind(this);
  }

  setConfig(config: SolarCardConfig) {
    const normalized = normalizeConfig(config);
    this._config = normalized;
    this.requestUpdate();
  }

  // Lovelace UI editor needs a static getter
  static getConfigElement() {
    return document.createElement('solar-card-editor');
  }

  static getStubConfig() {
    return stubConfig();
  }

  set hass(hass: Hass) {
    const prev = this._hass;
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
    const cfg = this._config;
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

  render() {
    const hass = this._hass;
    const cfg = this._config;
    const overview = this._computeOverviewValues(cfg);
    const today = this._computeTodayPanelValues(cfg);
    const totals = this._computeTotalsPanelValues(cfg);
    const forecast = this._computeForecastValues(cfg);
    const devicesList = cfg.show_top_devices ? this._computeTopDevicesLive(cfg.top_devices_max || 4) : [];
    const devicesView: TopDeviceBadgeView[] = devicesList.map((it) => ({
      id: it.id,
      name: it.name,
      icon: it.icon,
      value: `${formatNumberLocale(it.watts, this._hass, { maximumFractionDigits: 0 })} W`,
    }));

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
          <solar-card-overview-panel
            .data=${overview}
            .defaultSvg=${renderDefaultPanelsSvg()}
          ></solar-card-overview-panel>
          <solar-card-metrics-panel
            .config=${cfg}
            .today=${today}
            .totals=${totals}
          ></solar-card-metrics-panel>
          ${cfg.show_solar_forecast
            ? html`<solar-card-forecast-panel .data=${forecast} .hass=${this._hass}></solar-card-forecast-panel>`
            : nothing}
        </div>

        ${cfg.show_top_devices && devicesView.length
          ? html`<solar-card-top-devices
              .badges=${devicesView}
              @top-device-selected=${this._handleTopDeviceSelected}
            ></solar-card-top-devices>`
          : nothing}
        ${tiles.length
          ? html`<solar-card-trend-graphs
              .tiles=${tiles}
              .hass=${this._hass}
              .ensureRegistriesForNames=${this._trendEnsureRegistries}
              .stripName=${this._trendStripName}
            ></solar-card-trend-graphs>`
          : nothing}
        ${cfg.show_energy_flow
          ? html`<solar-card-energy-flow .hass=${this._hass}></solar-card-energy-flow>`
          : nothing}
      </ha-card>
    `;
  }

  private _computeOverviewValues(cfg: SolarCardConfig): OverviewPanelData {
    const hass = this._hass;
    return {
      production: entityDisplay(hass, cfg.production_entity),
      consumption: entityDisplay(hass, cfg.current_consumption_entity),
      imageUrl: cfg.image_url || '',
    };
  }

  private _computeTodayPanelValues(cfg: SolarCardConfig): MetricsTodayValues {
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

  private _computeTotalsPanelValues(cfg: SolarCardConfig): MetricsTotalsValues {
    const hass = this._hass;
    return {
      totalYield: entityDisplay(hass, cfg.total_yield_entity),
      totalGrid: entityDisplay(hass, cfg.total_grid_consumption_entity),
      batteryCapacity: entityDisplay(hass, cfg.battery_capacity_entity),
      inverterModeDisplay: entityDisplay(hass, cfg.inverter_mode_entity),
    };
  }

  private _computeForecastValues(cfg: SolarCardConfig): ForecastPanelData {
    const hass = this._hass;
    const weather = weatherDisplay(hass, cfg.weather_entity);
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

  private _handleTopDeviceSelected(ev: CustomEvent<{ statId?: string }>) {
    ev.stopPropagation();
    const statId = ev.detail?.statId;
    if (statId) this._openBadgeDevice(statId);
  }

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
    const result = await ensureDevicePowerMap(this._hass, this._deviceList ?? [], {
      entityRegistry: this._entityRegistry,
      deviceRegistry: this._deviceRegistry,
    });
    this._entityRegistry = result.entityRegistry;
    this._deviceRegistry = result.deviceRegistry;
    this._devicePowerMap = result.devicePowerMap;
    this._statToDeviceId = result.statToDeviceId;
    this._deviceEntitiesMap = result.deviceEntitiesMap;
    this._deviceIconById = result.deviceIconById;
    this._entityRegistryByEntityId = result.entityRegistryByEntityId;
  }

  private _computeTopDevicesLive(maxCount: number): DeviceBadgeItem[] {
    const state: DeviceLookupState = {
      devicePowerMap: this._devicePowerMap,
      statToDeviceId: this._statToDeviceId,
      deviceEntitiesMap: this._deviceEntitiesMap,
      deviceIconById: this._deviceIconById,
      entityRegistryByEntityId: this._entityRegistryByEntityId,
    };
    return computeTopDevicesLive(this._hass, state, this._deviceList ?? [], maxCount);
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
    return stripDeviceFromName(name, entityId, this._entityRegistry, this._deviceRegistry);
  }

  // Compute today's delta from a cumulative/total sensor using HA history API
  _ensureGridTodayFromTotal(entityId: string): DisplayValue | null {
    if (!this._hass || !entityId) return null;
    const hass = this._hass;
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
      fetchTodayDiff(hass, entityId)
        .then((num) => {
          const unit = hass?.states?.[entityId]?.attributes?.unit_of_measurement || '';
          const formatted = formatNumberLocale(num, hass, { maximumFractionDigits: 2 });
          this._gridTodayCache.result = { value: formatted, unit };
        })
        .catch(() => {
          this._gridTodayCache.result = {
            value: '—',
            unit: hass?.states?.[entityId]?.attributes?.unit_of_measurement || '',
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
    const hass = this._hass;
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
      fetchTodayDiff(hass, entityId)
        .then((num) => {
          const unit = hass?.states?.[entityId]?.attributes?.unit_of_measurement || '';
          const formatted = formatNumberLocale(num, hass, { maximumFractionDigits: 2 });
          this._yieldTodayCache.result = { value: formatted, unit };
        })
        .catch(() => {
          this._yieldTodayCache.result = {
            value: '—',
            unit: hass?.states?.[entityId]?.attributes?.unit_of_measurement || '',
          };
        })
        .finally(() => {
          this._yieldTodayCache.inflight = false;
          this.requestUpdate();
        });
    }
    return null;
  }
}

customElements.define('solar-card', HaSolarCard);
