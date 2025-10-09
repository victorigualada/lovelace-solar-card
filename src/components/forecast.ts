import { LitElement, html } from 'lit';
import type { Hass } from '../types/ha';
import { entityDisplay } from '../utils/entity';
import { formatTodayDate } from '../utils/date';

import { FORECAST_STYLE_CSS } from '../styles/forecast.styles';

export class SolarForecast extends LitElement {
  static get properties() {
    return {
      title: { reflect: true },
      icon: { reflect: true },
      majorValue: { attribute: 'major-value' },
      majorUnit: { attribute: 'major-unit' },
      minor: { },
      dateText: { attribute: 'date-text' },
      // Optional logic props
      hass: { attribute: false },
      weatherEntity: { attribute: 'weather-entity' },
      solarForecastEntity: { attribute: 'solar-forecast-entity' },
    } as any;
  }

  title = '';
  icon = 'mdi:weather-partly-cloudy';
  majorValue = '';
  majorUnit = '';
  minor = '';
  dateText = '';
  hass: Hass | null = null;
  weatherEntity?: string;
  solarForecastEntity?: string;

  private _iconFor(cond: string): string {
    const map: Record<string, string> = {
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

  private _computeFromEntities() {
    if (!this.hass) return;
    const hasWeather = !!this.weatherEntity;
    const hasSolarForecast = !!this.solarForecastEntity;
    const showSolarPrimary = hasSolarForecast || !hasWeather;
    if (!this.title) this.title = hasWeather ? 'Weather Today' : 'Solar Forecast';
    if (hasWeather && !this.icon) {
      const st = this.hass.states?.[this.weatherEntity!];
      const cond = st?.state || '';
      this.icon = this._iconFor(cond);
    }
    if (!this.dateText) this.dateText = formatTodayDate(this.hass);
    if (showSolarPrimary) {
      const disp = entityDisplay(this.hass, this.solarForecastEntity);
      if (!this.majorValue) this.majorValue = `${disp.value}`;
      if (!this.majorUnit) this.majorUnit = `${disp.unit || ''}`;
      if (!this.minor) this.minor = 'Expected forecast';
    } else {
      const st = this.hass.states?.[this.weatherEntity!];
      const temp = st?.attributes?.temperature;
      const unit = st?.attributes?.temperature_unit || this.hass?.config?.unit_system?.temperature || '°C';
      if (!this.majorValue) this.majorValue = temp != null ? String(temp) : '—';
      if (!this.majorUnit) this.majorUnit = unit;
      if (!this.minor) this.minor = st?.state || '';
    }
  }

  createRenderRoot() { return this; }

  render() {
    if (!this.majorValue && (this.weatherEntity || this.solarForecastEntity)) {
      this._computeFromEntities();
    }
    return html` <div class="forecast-panel">
      <style>${FORECAST_STYLE_CSS}</style>
      <div class="forecast" id="forecast">
        <div>
          <div class="title">${this.title}</div>
          <div class="subtle">${this.dateText}</div>
          <div class="temp">${this.majorValue} ${this.majorUnit}</div>
          <div class="subtle">${this.minor}</div>
        </div>
        <div class="icon">
          <ha-icon icon="${this.icon}"></ha-icon>
        </div>
      </div>
    </div>`;
  }
}

customElements.define('solar-forecast', SolarForecast);
