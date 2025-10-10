import { LitElement, html, css, nothing } from 'lit';
import { mdiDelete } from '@mdi/js';
import type { Hass } from './types/ha';
import { localize } from './localize/localize';
import type { SolarCardConfig, SolarCardTotalsMetric } from './types/solar-card-config';
import { iconForEntity } from './utils/icons';

export class HaSolarCardEditor extends LitElement {
  private static readonly MAX_METRICS = 6;
  private _hass: Hass | null;
  public config: SolarCardConfig;
  private readonly _metricFormSchema = [
    { name: 'entity', selector: { entity: {} } },
    { name: 'label', selector: { text: {} } },
    { name: 'unit', selector: { text: {} } },
    { name: 'use_entity_icon', selector: { boolean: {} } },
  ];
  private _expandedMetricIds: Set<string>;
  static styles = css`
    .editor {
      padding: 8px 0;
      display: grid;
      gap: 16px;
    }
    .section {
      display: grid;
      gap: 8px;
    }
    .section h3 {
      margin: 8px 0 0;
      font-weight: 600;
    }
    .dependent {
      margin-inline-start: 8px;
      padding: 12px;
      border-inline-start: 3px solid var(--divider-color, #d3dce5);
    }
    .dependent ha-form {
      margin-top: 4px;
    }
    .metrics-editor {
      display: grid;
      gap: 12px;
    }
    .metrics-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .metrics-list {
      display: grid;
      gap: 12px;
    }
    .metric-item {
      border: 1px solid var(--divider-color, #d3dce5);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      background: var(--card-background-color, var(--ha-card-background, white));
    }
    .metrics-empty {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    ha-expansion-panel.metric-item {
      --expansion-panel-content-padding: 0;
      --expansion-panel-summary-padding: 0;
      --expansion-panel-border-color: var(--divider-color, #d3dce5);
      --expansion-panel-border-radius: var(--ha-card-border-radius, 12px);
    }
    .metric-summary {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      padding: 4px 16px;
    }
    .metric-summary .metric-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      color: var(--secondary-text-color);
      cursor: grab;
      flex: 0 0 auto;
    }
    .metric-summary .metric-handle:active {
      cursor: grabbing;
    }
    .metric-summary .metric-handle ha-icon {
      --mdc-icon-size: 20px;
    }
    .metric-summary .title {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-width: 0;
      font-weight: 600;
      font-size: 0.95rem;
      flex: 1 1 auto;
    }
    .metric-summary .title span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .metric-summary .title-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .metric-summary .title-icon.placeholder {
      visibility: hidden;
    }
    .metric-summary .title-icon ha-icon {
      --mdc-icon-size: 24px;
      color: var(--secondary-text-color);
    }
    .summary-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-inline-start: auto;
    }
    .summary-actions ha-icon-button {
      --mdc-icon-size: 20px;
      color: var(--error-color);
      --mdc-icon-button-ink-color: var(--error-color);
    }
    .metric-content {
      display: grid;
      gap: 12px;
      padding: 0 16px 16px;
    }
    .remove-metric {
      justify-self: start;
      color: var(--error-color);
    }
    ha-button.add-metric {
      justify-self: end;
    }
  `;

  static get properties() {
    return {
      _hass: { attribute: false },
      config: { attribute: false },
    };
  }

  constructor() {
    super();
    this.config = { type: 'custom:solar-card' } as SolarCardConfig;
    this._hass = null;
    this._expandedMetricIds = new Set();
  }

  set hass(hass: Hass) {
    this._hass = hass;
    this.requestUpdate();
  }

  get hass(): Hass | null {
    return this._hass;
  }

  setConfig(config: SolarCardConfig) {
    this.config = config || {};
    this.requestUpdate();
  }

  _buildSchemas() {
    const cfg = this.config || {};
    const showSolarForecast = !!cfg.show_solar_forecast;
    const showTopDevices = !!cfg.show_top_devices;
    const overview = [
      { name: 'production_entity', required: true, selector: { entity: { domain: 'sensor', device_class: 'power' } } },
      {
        name: 'current_consumption_entity',
        required: true,
        selector: { entity: { domain: 'sensor', device_class: 'power' } },
      },
      { name: 'grid_feed_entity', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
      { name: 'image_url', selector: { text: {} } },
    ];
    const totals = [
      { name: 'total_yield_entity', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
      { name: 'total_grid_consumption_entity', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
    ];
    // Weather forecast section
    const weatherToggle = [{ name: 'show_solar_forecast', selector: { boolean: {} } }];
    const weatherOptions = showSolarForecast
      ? [
          { name: 'weather_entity', selector: { entity: { domain: 'weather' } } },
          {
            name: 'solar_forecast_today_entity',
            selector: { entity: { domain: 'sensor', device_class: 'energy' } },
          },
        ]
      : [];
    // Top consuming devices section
    const topDevicesToggle = [{ name: 'show_top_devices', selector: { boolean: {} } }];
    const topDevicesOptions = showTopDevices
      ? [
          { name: 'top_devices_max', selector: { number: { min: 1, max: 8, mode: 'box' } } },
          { name: 'grid_feed_charging_entity', selector: { entity: { domain: 'binary_sensor' } } },
          { name: 'device_badge_intensity', selector: { boolean: {} } },
        ]
      : [];
    // Trend graphs section (includes legacy single entity)
    const trend = [
      { name: 'trend_graph_entities', selector: { entity: { multiple: true, domain: 'sensor' } } },
      { name: 'trend_graph_hours_to_show', selector: { number: { min: 1, max: 168, mode: 'box' } } },
    ];
    // Sankey section
    const sankey = [{ name: 'show_energy_flow', selector: { boolean: {} } }];
    return { overview, totals, weatherToggle, weatherOptions, topDevicesToggle, topDevicesOptions, trend, sankey };
  }

  render() {
    const schemas = this._buildSchemas();
    return html`
      <div class="editor">
        <div class="section">
          <h3>${localize('editor.section_overview')}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.overview}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
        <div class="section">
          <h3>${localize('editor.section_totals_sources')}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.totals}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
        <div class="section">
          <h3>${localize('editor.section_custom_metrics')}</h3>
          ${this._renderTotalsMetricsSection()}
        </div>
        <div class="section">
          <h3>${localize('editor.section_weather')}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.weatherToggle}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
          ${schemas.weatherOptions.length
            ? html`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${this.config}
                  .schema=${schemas.weatherOptions}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>`
            : null}
        </div>
        <div class="section">
          <h3>${localize('editor.section_top_devices')}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.topDevicesToggle}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
          ${schemas.topDevicesOptions.length
            ? html`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${this.config}
                  .schema=${schemas.topDevicesOptions}
                  .computeLabel=${this._computeLabel}
                  .computeHelper=${this._computeHelper}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>`
            : null}
        </div>
        <div class="section">
          <h3>${localize('editor.section_trend')}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.trend}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
        <div class="section">
          <h3>${localize('editor.section_sankey')}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.sankey}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  private _renderTotalsMetricsSection() {
    const hasCustomMetrics = Array.isArray(this.config?.totals_metrics);
    const metrics = hasCustomMetrics ? this._getMetricsForEditor() : [];
    this._syncExpandedMetricIds(metrics);
    const maxReached = metrics.length >= HaSolarCardEditor.MAX_METRICS;
    const showEmpty = metrics.length === 0;
    return html`
      <div class="metrics-editor">
        ${metrics.length
          ? html`<ha-sortable
              .disabled=${metrics.length < 2}
              draggable-selector=".metric-item"
              handle-selector=".metric-handle"
              @item-moved=${this._onMetricReorder}
            >
              <div class="metrics-list">${metrics.map((metric, index) => this._renderMetricItem(metric, index))}</div>
            </ha-sortable>`
          : nothing}
        ${showEmpty ? html`<div class="metrics-empty">${localize('editor.metrics_empty')}</div>` : nothing}
        <ha-button class="add-metric" @click=${this._handleAddMetric} .disabled=${maxReached}>
          <ha-icon slot="start" icon="mdi:plus"></ha-icon>
          ${localize('editor.add_metric')}
        </ha-button>
      </div>
    `;
  }

  private _renderMetricItem(metric: SolarCardTotalsMetric, index: number) {
    const schema = this._metricFormSchema;
    const metricId = metric.id || `metric-${index + 1}`;
    const expanded = this._expandedMetricIds.has(metricId);
    const title = this._metricTitle(metric, index);
    const previewIcon = this._resolveMetricPreviewIcon(metric);
    return html`
      <ha-expansion-panel
        class="metric-item"
        .expanded=${expanded}
        data-metric-id=${metricId}
        @expanded-changed=${this._onMetricExpandedChanged}
      >
        <div slot="header" class="metric-summary">
          <div
            class="metric-handle"
            role="button"
            aria-label=${localize('editor.reorder_metric')}
            title=${localize('editor.reorder_metric')}
            @click=${this._onHandleClick}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </div>
          <span class="title">
            <span class="title-icon ${previewIcon ? '' : 'placeholder'}">
              ${previewIcon ? html`<ha-icon icon="${previewIcon}"></ha-icon>` : nothing}
            </span>
            <span>${title}</span>
          </span>
          <div class="summary-actions">
            <ha-icon-button
              class="remove-icon"
              data-index=${index}
              .path=${mdiDelete}
              .label=${localize('editor.remove_metric')}
              @click=${this._onMetricDelete}
            ></ha-icon-button>
          </div>
        </div>
        <div class="metric-content">
          <ha-form
            .hass=${this._hass}
            .data=${metric}
            .schema=${schema}
            .computeLabel=${this._computeMetricFieldLabel}
            data-index=${index}
            @value-changed=${this._onMetricValueChanged}
          ></ha-form>
          ${metric.use_entity_icon !== false
            ? nothing
            : html`<div class="dependent">
                <ha-form
                  .hass=${this._hass}
                  .data=${metric}
                  .schema=${[{ name: 'icon', selector: { icon: {} } }]}
                  .computeLabel=${this._computeMetricFieldLabel}
                  data-index=${index}
                  @value-changed=${this._onMetricValueChanged}
                ></ha-form>
              </div>`}
        </div>
      </ha-expansion-panel>
    `;
  }

  private _metricTitle(metric: SolarCardTotalsMetric, index: number) {
    const label = typeof metric.label === 'string' ? metric.label.trim() : '';
    if (label) return label;
    const entityId = typeof metric.entity === 'string' ? metric.entity.trim() : '';
    if (entityId) {
      const friendly = this._hass?.states?.[entityId]?.attributes?.friendly_name;
      if (friendly && typeof friendly === 'string') return friendly;
      const [, namePart] = entityId.split('.', 2);
      return namePart ? namePart.replace(/_/g, ' ') : entityId;
    }
    return `${localize('card.total_metric')} ${index + 1}`;
  }

  private _getMetricsForEditor(): SolarCardTotalsMetric[] {
    const cfgMetrics = this.config?.totals_metrics;
    if (!Array.isArray(cfgMetrics)) return [];
    return cfgMetrics.map((metric, idx) => this._normalizeMetric(metric, idx));
  }

  private _normalizeMetric(metric: SolarCardTotalsMetric | undefined, index: number): SolarCardTotalsMetric {
    const entity = typeof metric?.entity === 'string' && metric.entity ? metric.entity : undefined;
    const rawLabel = typeof metric?.label === 'string' ? metric.label : '';
    const label = rawLabel.trim() ? rawLabel : undefined;
    const unit = typeof metric?.unit === 'string' && metric.unit ? metric.unit : undefined;
    const icon = typeof metric?.icon === 'string' && metric.icon ? metric.icon : undefined;
    const useEntityIcon = metric?.use_entity_icon !== false; // default true
    const baseId = typeof metric?.id === 'string' && metric.id ? metric.id : entity ? entity : `metric-${index + 1}`;
    const normalized: SolarCardTotalsMetric = { id: baseId };
    if (entity) normalized.entity = entity;
    if (label) normalized.label = label;
    if (unit) normalized.unit = unit;
    if (icon) normalized.icon = icon;
    normalized.use_entity_icon = useEntityIcon;
    return normalized;
  }

  private _syncExpandedMetricIds(metrics: SolarCardTotalsMetric[]) {
    const validIds = new Set(
      metrics.map((metric) => (typeof metric.id === 'string' && metric.id ? metric.id : '')).filter(Boolean),
    );
    let changed = false;
    for (const id of Array.from(this._expandedMetricIds)) {
      if (!validIds.has(id)) {
        this._expandedMetricIds.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this._expandedMetricIds = new Set(this._expandedMetricIds);
    }
  }

  private _prepareMetricsForMutation(): SolarCardTotalsMetric[] {
    return this._getMetricsForEditor().map((metric) => ({ ...metric }));
  }

  private _commitMetrics(metrics: SolarCardTotalsMetric[]) {
    const sanitized = metrics.map((metric, index) => this._sanitizeMetric(metric, index));
    this._applyConfigUpdate({ totals_metrics: sanitized.length ? sanitized : [] });
  }

  private _sanitizeMetric(metric: SolarCardTotalsMetric, index: number): SolarCardTotalsMetric {
    const entity = typeof metric.entity === 'string' && metric.entity.trim() ? metric.entity.trim() : undefined;
    const rawLabel = typeof metric.label === 'string' ? metric.label : '';
    const label = rawLabel.trim() ? rawLabel : undefined;
    const unit = typeof metric.unit === 'string' && metric.unit.trim() ? metric.unit.trim() : undefined;
    const icon = typeof metric.icon === 'string' && metric.icon.trim() ? metric.icon.trim() : undefined;
    const useEntityIcon = metric.use_entity_icon !== false; // default true
    const baseId =
      typeof metric.id === 'string' && metric.id ? metric.id : entity ? entity : this._generateMetricId(index);
    const result: SolarCardTotalsMetric = { id: baseId };
    if (entity) result.entity = entity;
    if (label) result.label = label;
    if (unit) result.unit = unit;
    if (icon) result.icon = icon;
    // Only persist this flag when false (to avoid writing defaults)
    if (!useEntityIcon) (result as any).use_entity_icon = false;
    return result;
  }

  private _generateMetricId(seed: number) {
    try {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return (crypto as Crypto).randomUUID();
      }
    } catch (_e) {
      /* ignore */
    }
    return `metric-${Date.now()}-${seed}`;
  }

  private _handleAddMetric = (ev: Event) => {
    ev.stopPropagation();
    const metrics = this._prepareMetricsForMutation();
    if (metrics.length >= HaSolarCardEditor.MAX_METRICS) return;
    const newId = this._generateMetricId(metrics.length);
    metrics.push({ id: newId });
    const expanded = new Set(this._expandedMetricIds);
    expanded.add(newId);
    this._expandedMetricIds = expanded;
    this._commitMetrics(metrics);
  };

  private _onMetricValueChanged = (ev: CustomEvent) => {
    ev.stopPropagation();
    const form = ev.currentTarget as HTMLElement | null;
    const index = Number(form?.dataset?.index ?? -1);
    if (index < 0) return;
    const metrics = this._prepareMetricsForMutation();
    if (!metrics[index]) return;
    metrics[index] = { ...metrics[index], ...(ev.detail?.value || {}) };
    this._commitMetrics(metrics);
  };

  private _onMetricDelete = (ev: Event) => {
    ev.stopPropagation();
    const index = Number((ev.currentTarget as HTMLElement)?.dataset?.index ?? -1);
    if (index < 0) return;
    const metrics = this._prepareMetricsForMutation();
    if (!metrics[index]) return;
    metrics.splice(index, 1);
    this._commitMetrics(metrics);
  };

  private _onMetricReorder = (ev: CustomEvent<{ oldIndex: number; newIndex: number }>) => {
    ev.stopPropagation();
    const detail = ev.detail;
    if (!detail) return;
    const oldIndex = Number.isFinite(detail.oldIndex) ? detail.oldIndex : -1;
    const newIndex = Number.isFinite(detail.newIndex) ? detail.newIndex : -1;
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
    const metrics = this._prepareMetricsForMutation();
    if (!metrics.length || oldIndex >= metrics.length) return;
    const [moved] = metrics.splice(oldIndex, 1);
    if (!moved) return;
    const targetIndex = Math.min(newIndex, metrics.length);
    metrics.splice(targetIndex, 0, moved);
    this._commitMetrics(metrics);
  };

  private _onMetricExpandedChanged = (ev: CustomEvent<{ expanded: boolean }>) => {
    ev.stopPropagation();
    const panel = ev.currentTarget as HTMLElement | null;
    const metricId = panel?.dataset?.metricId;
    if (!metricId) return;
    const expanded = Boolean(ev.detail?.expanded);
    const next = new Set(this._expandedMetricIds);
    if (expanded) {
      next.add(metricId);
    } else {
      next.delete(metricId);
    }
    this._expandedMetricIds = next;
  };

  private _computeMetricFieldLabel = (schema) => {
    const map: Record<string, string> = {
      label: localize('editor.metric_label'),
      entity: localize('editor.metric_entity'),
      unit: localize('editor.metric_unit'),
      icon: localize('editor.metric_icon'),
      use_entity_icon: localize('editor.metric_use_entity_icon'),
    };
    return map[schema.name] || schema.name;
  };

  private _onHandleClick = (ev: Event) => {
    ev.stopPropagation();
  };

  _valueChanged = (ev) => {
    ev.stopPropagation();
    this._applyConfigUpdate(ev.detail.value);
  };

  private _applyConfigUpdate(partial: Partial<SolarCardConfig>) {
    const newConfig = { ...this.config, ...partial };
    this.config = newConfig;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _computeLabel = (schema) => {
    const key = `editor.label_${schema.name}`;
    const localized = localize(key);
    return localized && localized !== key ? localized : schema.name;
  };

  _computeHelper = (schema) => {
    const key = `editor.helper_${schema.name}`;
    const localized = localize(key);
    return localized && localized !== key ? localized : undefined;
  };

  private _resolveMetricPreviewIcon(metric: SolarCardTotalsMetric): string | null {
    const useEntityIcon = metric?.use_entity_icon !== false; // default true
    const entityId = typeof metric?.entity === 'string' ? metric.entity : undefined;
    if (useEntityIcon && entityId) {
      const icon = iconForEntity(this._hass, entityId);
      if (typeof icon === 'string' && icon) return icon;
    }
    const custom = typeof metric?.icon === 'string' && metric.icon.trim() ? metric.icon.trim() : '';
    return custom || null;
  }
}

customElements.define('solar-card-editor', HaSolarCardEditor);
