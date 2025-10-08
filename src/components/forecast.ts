import { LitElement, html } from 'lit';

export class SolarForecast extends LitElement {
  static get properties() {
    return {
      title: { reflect: true },
      icon: { reflect: true },
      majorValue: { attribute: 'major-value' },
      majorUnit: { attribute: 'major-unit' },
      minor: { },
      dateText: { attribute: 'date-text' },
    } as any;
  }

  title = '';
  icon = 'mdi:weather-partly-cloudy';
  majorValue = '';
  majorUnit = '';
  minor = '';
  dateText = '';

  createRenderRoot() { return this; }

  render() {
    return html` <div class="forecast-panel">
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

