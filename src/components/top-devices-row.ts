import { LitElement, html, css, nothing } from 'lit';

export interface TopDeviceBadgeView {
  id: string;
  name: string;
  icon?: string;
  value: string;
}

class SolarCardTopDevicesRow extends LitElement {
  static get properties() {
    return {
      badges: { attribute: false },
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .devices-row {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      margin-top: 12px;
      padding-top: 12px;
    }

    .badges {
      display: flex;
      gap: 8px;
      align-items: stretch;
      width: 100%;
      cursor: pointer;
    }

    .badge {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 8px;
      background: var(--chip-background-color, rgba(0, 0, 0, 0.03));
      color: var(--primary-text-color);
      padding: 6px 10px;
      border-radius: 16px;
      border: 1px solid transparent;
      white-space: nowrap;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      cursor: pointer;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        box-shadow 120ms ease;
    }

    .badge:hover {
      background: rgba(var(--rgb-primary-color), 0.08);
      border-color: var(--primary-color);
    }

    .badge ha-icon {
      color: var(--secondary-text-color);
    }

    .badge .name {
      max-width: 14ch;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .badge .value {
      font-weight: 600;
      justify-self: end;
      text-align: right;
    }

    @container (max-width: 900px) {
      .badges {
        flex-wrap: wrap;
        justify-content: center;
      }

      .badge {
        max-width: 40%;
      }
    }
  `;

  badges: TopDeviceBadgeView[] = [];

  render() {
    if (!this.badges?.length) return nothing;

    return html`<div class="devices-row" @click=${this._handleClick}>
      <div class="badges">
        ${this.badges.map(
          (badge) => html`<div class="badge" role="listitem" data-stat-id="${badge.id}">
            <ha-icon icon="${badge.icon || 'mdi:power-plug'}"></ha-icon>
            <span class="name">${badge.name}</span>
            <span class="value">${badge.value}</span>
          </div>`,
        )}
      </div>
    </div>`;
  }

  private _handleClick(ev: Event) {
    const target = ev.composedPath
      ? (ev.composedPath() as EventTarget[]).find((n) => (n as HTMLElement)?.classList?.contains?.('badge'))
      : (ev.target as HTMLElement).closest?.('.badge');
    const statId = (target as HTMLElement | undefined)?.getAttribute?.('data-stat-id');
    if (!statId) return;
    this.dispatchEvent(
      new CustomEvent('top-device-selected', {
        detail: { statId },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('solar-card-top-devices', SolarCardTopDevicesRow);

export { SolarCardTopDevicesRow };
