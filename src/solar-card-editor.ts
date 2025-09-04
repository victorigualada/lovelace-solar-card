import { LitElement, html, css } from 'lit';
import type { Hass } from './types/ha';
import type { SolarCardConfig } from './types/solar-card-config';

export class HaSolarCardEditor extends LitElement {
  private _hass: Hass | null;
  public config: SolarCardConfig;
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
  `;

  static get properties() {
    return {
      _hass: { attribute: false },
      config: { attribute: false },
    };
  }

  constructor() {
    super();
    this.config = { type: 'solar-card' } as SolarCardConfig;
    this._hass = null;
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
    const overview = [
      { name: 'production_entity', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
      { name: 'current_consumption_entity', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
      { name: 'image_url', selector: { text: {} } },
    ];
    const today = [
      { name: 'yield_today_entity', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
      { name: 'grid_consumption_today_entity', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
      { name: 'battery_percentage_entity', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
      { name: 'inverter_state_entity', selector: { entity: { domain: 'sensor' } } },
    ];
    const totals = [
      { name: 'total_yield_entity', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
      { name: 'total_grid_consumption_entity', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
      { name: 'battery_capacity_entity', selector: { entity: { domain: 'sensor' } } },
      { name: 'inverter_mode_entity', selector: { entity: { domain: 'sensor' } } },
    ];
    const options = [
      { name: 'show_energy_flow', selector: { boolean: {} } },
      { name: 'show_top_devices', selector: { boolean: {} } },
    ];
    if (cfg.show_top_devices) {
      // @ts-expect-error dynamic schema
      options.push({ name: 'top_devices_max', selector: { number: { min: 1, max: 8, mode: 'box' } } });
    }
    options.push({ name: 'show_solar_forecast', selector: { boolean: {} } });
    if (cfg.show_solar_forecast) {
      // @ts-expect-error dynamic schema
      options.push({ name: 'weather_entity', selector: { entity: { domain: 'weather' } } });
      options.push({
        name: 'solar_forecast_today_entity',
        // @ts-expect-error dynamic schema
        selector: { entity: { domain: 'sensor', device_class: 'energy' } },
      });
    }
    return { overview, today, totals, options };
  }

  render() {
    const schemas = this._buildSchemas();
    return html`
      <div class="editor">
        <div class="section">
          <h3>Overview</h3>
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
          <h3>Today</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.today}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
        <div class="section">
          <h3>Totals & Settings</h3>
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
          <h3>Options</h3>
          <ha-form
            .hass=${this._hass}
            .data=${this.config}
            .schema=${schemas.options}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  _valueChanged = (ev) => {
    ev.stopPropagation();
    const newConfig = { ...this.config, ...ev.detail.value };
    this.config = newConfig;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      }),
    );
  };

  _computeLabel = (schema) => {
    const labelMap = {
      production_entity: 'PV production entity (W / kW)',
      current_consumption_entity: 'Current consumption entity (W / kW)',
      show_energy_flow: 'Show Energy Flow (built-in)',
      show_top_devices: 'Show top devices row',
      top_devices_max: 'Max device badges (1–8)',
      show_solar_forecast: 'Show solar forecast panel',
      weather_entity: 'Weather entity (optional)',
      solar_forecast_today_entity: 'Solar forecast today entity (kWh, optional)',
      yield_today_entity: 'Yield today entity (kWh)',
      grid_consumption_today_entity: 'Grid consumption today entity (kWh)',
      battery_percentage_entity: 'Battery percentage entity (%)',
      inverter_state_entity: 'Inverter state entity (text)',
      total_yield_entity: 'Total yield entity (kWh)',
      total_grid_consumption_entity: 'Total grid consumption entity (kWh)',
      battery_capacity_entity: 'Battery capacity entity (kWh)',
      inverter_mode_entity: 'Inverter mode entity (text sensor)',
      image_url: 'Image URL (optional)',
    } as Record<string, string>;
    return labelMap[schema.name] || schema.name;
  };

  _computeHelper = (schema) => {
    const helperMap = {
      yield_today_entity: "Optional. Leave empty to compute from 'Total yield' using today's history (00:00 → now).",
      grid_consumption_today_entity:
        "Optional. Leave empty to compute from 'Total grid consumption' using today's history (00:00 → now).",
      show_energy_flow: 'Adds the built-in Energy Flow (Sankey) graph below this card (requires Energy configuration).',
      show_top_devices:
        'Adds a single-row list of top-consuming devices from Energy preferences (requires Energy configuration).',
      top_devices_max: 'Number of top-consuming device badges to display',
      show_solar_forecast: 'Shows a compact forecast panel aligned to the right.',
      weather_entity: 'If set, shows temperature and condition for today.',
      solar_forecast_today_entity: "If set and no weather entity, shows today's expected solar production.",
    } as Record<string, string>;
    return helperMap[schema.name];
  };
}

customElements.define('solar-card-editor', HaSolarCardEditor);
