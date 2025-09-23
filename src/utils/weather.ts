import type { Hass } from '../types/ha';

export function weatherIcon(condition: string): string {
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
  return map[condition] || 'mdi:weather-partly-cloudy';
}

export function weatherDisplay(
  hass: Hass | null,
  entityId?: string | null,
): { temperature: string | null; unit?: string; condition?: string; icon?: string } {
  if (!entityId) return { temperature: null };
  const st = hass?.states?.[entityId];
  if (!st) return { temperature: null };
  const temp = st.attributes?.temperature;
  const unit = st.attributes?.temperature_unit || hass?.config?.unit_system?.temperature || '°C';
  const condition = st.state || '';
  const icon = weatherIcon(condition);
  return { temperature: temp != null ? String(temp) : null, unit, condition, icon };
}
