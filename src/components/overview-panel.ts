import { LitElement, html, css, nothing } from 'lit';
import { localize } from '../localize/localize';
import type { DisplayValue } from '../types/solar-card-config';

export interface OverviewPanelData {
  production: DisplayValue;
  consumption: DisplayValue;
  imageUrl: string;
}

class SolarCardOverviewPanel extends LitElement {
  static get properties() {
    return {
      data: { attribute: false },
      defaultSvg: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .overview-panel {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 40px;
      align-items: center;
      padding-right: 16px;
    }

    .content {
      display: grid;
      gap: 10px;
    }

    .metric {
      min-width: 0;
    }

    .metric .label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 1.2rem;
      padding-bottom: 4px;
      color: var(--secondary-text-color);
    }

    .metric .value {
      font-weight: 700;
      font-size: 2rem;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric .value.smaller {
      font-size: 1.4rem;
    }

    .metric .label ha-icon {
      color: var(--secondary-text-color);
      width: 28px;
      height: 28px;
      --mdc-icon-size: 28px;
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

    @container (max-width: 1200px) {
      .overview-panel {
        padding-right: 0;
        padding-bottom: 12px;
        display: flex;
        gap: 12px;
        align-items: start;
      }
      .image {
        width: clamp(100px, 28cqi, 150px);
        max-width: 150px;
        justify-self: end;
      }
    }

    @container (max-width: 900px) {
      .overview-panel {
        grid-template-columns: 1fr auto;
      }
      .image {
        width: clamp(90px, 26cqi, 130px);
        max-width: 130px;
      }
    }

    @container (max-width: 700px) {
      .overview-panel {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .image {
        order: 2;
        justify-self: start;
        width: clamp(80px, 40cqi, 120px);
        max-width: 120px;
      }
    }

    @container (max-width: 568px) {
      :host {
        width: 100%;
      }
      .overview-panel {
        grid-template-columns: 1fr auto;
      }
      .image {
        width: clamp(90px, 32cqi, 130px);
        max-width: 130px;
      }
    }
  `;

  data?: OverviewPanelData;
  defaultSvg?: ReturnType<typeof html>;

  render() {
    if (!this.data) return nothing;
    const { production, consumption, imageUrl } = this.data;
    return html`
      <div class="overview-panel">
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
          ${imageUrl
            ? html`<img src="${imageUrl}" alt="Solar panels" loading="lazy" />`
            : this.defaultSvg || nothing}
        </div>
      </div>
    `;
  }
}

customElements.define('solar-card-overview-panel', SolarCardOverviewPanel);

export { SolarCardOverviewPanel };
