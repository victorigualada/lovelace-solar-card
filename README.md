# Solar Energy Card for Home Assistant

<p align="center">
  <img src="https://github.com/victorigualada/lovelace-solar-card/raw/main/docs/images/overview-desktop.png" width="80%"/>
</p>

#### Also with optional built-in Energy Sankey flow graph
<p align="center">
  <img src="https://github.com/victorigualada/lovelace-solar-card/raw/main/docs/images/overview-desktop-full.png" width="70%"/>
  <img src="https://github.com/victorigualada/lovelace-solar-card/raw/main/docs/images/overview-mobile.png" width="13.4%" hspace="10"/>
</p>


## Features

- Left panel: production and current consumption with optional image/illustration
- Today metrics: yield today, grid today, battery percentage, inverter state
- Totals: lifetime yield, total grid consumption, battery capacity, inverter mode
- Optional devices row: lists top consuming devices (from Energy preferences)
- Optional energy flow: embeds the built‑in Energy Sankey card below
- Optional compact forecast panel: weather or expected solar forecast
- Localized UI: en, es, fr, de, pt; auto‑syncs to HA language
- Responsive layout: adapts cleanly from wide to mobile widths

## Installation

### HACS (Custom Repository)
1. In HACS → Frontend → Three dots → Custom repositories
2. Add this repo URL as type “Lovelace”
3. Install “Solar Energy Card”
4. Add the resource:

```yaml
url: /hacsfiles/lovelace-solar-card/solar-card.js
type: module
```

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
<img src="https://github.com/victorigualada/lovelace-solar-card/raw/main/docs/images/configuration.png" width="80%"/>
</p>

<br />

You can also use YAML:

```yaml
type: custom:solar-card
# Left panel (required)
production_entity: sensor.pv_production_now            # W or kW (required)
current_consumption_entity: sensor.house_consumption    # W or kW (required)
image_url: https://example.com/your/solar.jpg          # optional

# Today (top-right) — optional; metrics render only when configured or derivable
yield_today_entity: sensor.pv_yield_today               # kWh (optional; or derive from total_yield)
grid_consumption_today_entity: sensor.grid_today        # kWh (optional; or derive from total_grid_consumption)
battery_percentage_entity: sensor.battery_soc           # % (optional)
inverter_state_entity: sensor.inverter_state            # text (optional)

# Totals (bottom-right)
total_yield_entity: sensor.pv_total_yield               # kWh
total_grid_consumption_entity: sensor.grid_total        # kWh
battery_capacity_entity: sensor.battery_capacity        # kWh (optional)
inverter_mode_entity: sensor.inverter_mode              # text

# Options
show_energy_flow: true                                  # show built‑in Energy Sankey
show_top_devices: true                                  # show devices row
top_devices_max: 4                                      # 1–8
show_solar_forecast: true                               # enable forecast column
weather_entity: weather.home                            # optional (shows weather)
solar_forecast_today_entity: sensor.solar_forecast_today # optional (shows forecast)
```

Notes:
- The left panel requires both production and current consumption entities.
- The Today section is optional. Each metric shows only if its entity is configured; for Yield/Grid it can also show if the corresponding total is set (derived via history since midnight).
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
