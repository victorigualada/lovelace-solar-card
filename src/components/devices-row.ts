import { LitElement, html } from 'lit';

export class SolarDevicesRow extends LitElement {
  static get properties() {
    return {
      items: { attribute: false },
    };
  }

  items!: Array<{ id: string; name: string; icon?: string; display?: string }>;

  createRenderRoot() { return this; }

  render() {
    const list = Array.isArray(this.items) ? this.items : [];
    return html` <div class="devices-row" id="devices-row">
      <div class="badges">
        ${list.map(
          (it) => html`<div class="badge" role="listitem" data-stat-id="${it.id}">
            <ha-icon icon="${it.icon || 'mdi:power-plug'}"></ha-icon>
            <span class="name">${it.name}</span>
            <span class="value">${it.display || ''}</span>
          </div>`,
        )}
      </div>
    </div>`;
  }
}

customElements.define('solar-devices-row', SolarDevicesRow);

