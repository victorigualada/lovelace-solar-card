# Solar Energy Card for Home Assistant

<p align="center">
  <img src="https://github.com/victorigualada/lovelace-solar-card/raw/refs/heads/main/docs/images/overview-desktop.png" width="80%"/>
</p>

#### Also with optional built-in Energy Sankey flow graph

<p align="center">
  <img src="https://github.com/victorigualada/lovelace-solar-card/raw/refs/heads/main/docs/images/overview-desktop-full.png" width="754"/>
  <img src="https://github.com/victorigualada/lovelace-solar-card/raw/refs/heads/main/docs/images/overview-mobile.png" height="345" hspace="10"/>
</p>

## Features

- Left panel: production and current consumption with optional image/illustration
- Today metrics: yield today, grid today, battery percentage, inverter state
- Totals grid: lifetime yield, total grid consumption, battery capacity, inverter mode
- Custom totals metrics: add up to 8 extra entities with friendly labels (8 when today's metrics are hidden; otherwise 6)
- Drag-and-drop ordering: reorder custom metrics directly in the visual editor
- Optional devices row: lists top consuming devices (from Energy preferences)
- Optional energy flow: embeds the built‑in Energy Sankey card below
- Optional compact forecast panel: weather or expected solar forecast
- Localized UI: en, es, fr, de, pt; auto‑syncs to HA language
- Responsive layout: adapts cleanly from wide to mobile widths

## Installation

### HACS (Custom Repository)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=victorigualada&repository=lovelace-solar-card&category=plugin)

### Manual

1. Download `solar-card.js` from the [latest release](https://github.com/victorigualada/lovelace-solar-card/releases)
2. Place it in `www/` (e.g., `/config/www/solar-card.js`)
3. Add the resource:

```yaml
url: /local/solar-card.js
type: module
```

## Usage

Add a new card in Lovelace and search for “Solar Card”. The visual editor guides you through configuration.

<p align="center">
<img src="https://github.com/victorigualada/lovelace-solar-card/raw/refs/heads/main/docs/images/configuration.png" width="80%"/>
</p>

<br />

You can also use YAML:

```yaml
type: custom:solar-card
# Left panel (required)
production_entity: sensor.pv_production_now # W or kW (required)
current_consumption_entity: sensor.house_consumption # W or kW (required)
image_url: https://example.com/your/solar.jpg # optional

# Totals (right panels)
total_yield_entity: sensor.pv_total_yield # kWh
total_grid_consumption_entity: sensor.grid_total # kWh
# Hide the two "today" metrics (yield/grid) to show more custom metrics
show_today_metrics: true
# Optional custom metrics for the totals grid (up to 8 entries, supports drag & drop ordering)
totals_metrics:
  - entity: sensor.pv_total_yield
    label: Total yield
  - entity: sensor.grid_total
    label: Grid consumption
  - entity: sensor.battery_total_throughput
    label: Battery throughput

# Options
show_energy_flow: true # show built‑in Energy Sankey
show_top_devices: true # show devices row
top_devices_max: 4 # 1–8
trend_graph_entities: # optional list of tile trend graphs
  - sensor.grid_energy_daily
  - sensor.pv_yield_today
show_solar_forecast: true # enable forecast column
weather_entity: weather.home # optional (shows weather)
solar_forecast_today_entity: sensor.solar_forecast_today # optional (shows forecast)
```

Notes:

- The left panel requires both production and current consumption entities.
- The Today section shows derived yield and grid consumption metrics automatically when enabled. You can disable it with `show_today_metrics: false` to display up to 8 custom totals metrics.
- Custom totals metrics accept any label (spaces allowed) and the order you set in the editor is preserved in the card.
- If `trend_graph_entities` is set, the card renders one Tile per entity with the Tile "trend-graph" feature between the devices row and the Energy Sankey.
- The devices row uses Energy preferences → “Individual devices” and will show devices currently consuming power based on associated power sensors.
- The Energy Flow section requires that your Energy dashboard is configured.

## FAQ

- Why don’t I see devices? Ensure you have devices configured under Settings → Energy → Individual devices, and that matching power sensors exist (W/kW).
- Can the card compute “today” values? Yes; if daily sensors are missing, it computes deltas since midnight from total (cumulative) sensors.
- Where do the icons for the devices come from? The card prefers device registry icon, then entity icons, then domain heuristics.

## Contributing / Development

Requirements

- Node.js >= 18.18 (for the ESLint + TS toolchain)

Commands

- Install: `yarn`
- Dev server: `yarn start` (Rollup watch)
- Build: `yarn build`

During development, add the built resource in HA as:

```yaml
url: 'http://127.0.0.1:5000/solar-card.js'
type: module
```
