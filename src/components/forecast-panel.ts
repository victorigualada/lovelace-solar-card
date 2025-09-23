import { LitElement, html, css, nothing } from 'lit';
import { localize } from '../localize/localize';
import { formatTodayDate } from '../utils/datetime';
import type { Hass } from '../types/ha';

export interface ForecastPanelData {
  title: string;
  icon: string;
  majorValue: string;
  majorUnit: string;
  minor: string;
}

class SolarCardForecastPanel extends LitElement {
  static get properties() {
    return {
      data: { attribute: false },
      hass: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .forecast-panel {
      border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-left: 16px;
      display: grid;
      align-content: start;
      align-self: stretch;
    }

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

    @container (max-width: 1200px) {
      :host(.no-forecast-border) .forecast-panel {
        border-left: none;
        padding-left: 0;
      }
    }

    @container (max-width: 700px) {
      .forecast-panel {
        order: 3;
        width: 100%;
        border-left: none;
        padding-left: 0;
        padding-top: 12px;
      }

      .forecast {
        padding: 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    }

    @container (max-width: 568px) {
      .forecast {
        justify-self: stretch;
        max-width: none;
      }
    }
  `;

  data?: ForecastPanelData;
  hass: Hass | null = null;

  render() {
    if (!this.data) return nothing;
    const { title, icon, majorValue, majorUnit, minor } = this.data;
    const dateLabel = formatTodayDate(this.hass);
    return html`
      <div class="forecast-panel">
        <div class="forecast" id="forecast">
          <div>
            <div class="title">${title}</div>
            <div class="subtle">${dateLabel}</div>
            <div class="temp">${majorValue} ${majorUnit}</div>
            <div class="subtle">${minor}</div>
          </div>
          <div class="icon">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('solar-card-forecast-panel', SolarCardForecastPanel);

export { SolarCardForecastPanel };
