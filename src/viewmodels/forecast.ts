import type { Hass } from '../types/ha';
import type { SolarCardConfig } from '../types';
import { weatherDisplay } from '../utils/weather';
import { entityDisplay } from '../utils/entity';
import { localize } from '../localize/localize';

export function computeForecast(hass: Hass | null, cfg: SolarCardConfig) {
  const weather = weatherDisplay(hass, cfg.weather_entity);
  const solarForecastToday = entityDisplay(hass, cfg.solar_forecast_today_entity);
  const hasWeather = !!cfg.weather_entity;
  const hasSolarForecast = !!cfg.solar_forecast_today_entity;
  const showSolarPrimary = hasSolarForecast || !hasWeather;
  return {
    title: hasWeather ? localize('card.weather_today') : localize('card.solar_forecast'),
    icon: hasWeather ? weather.icon || 'mdi:weather-partly-cloudy' : 'mdi:white-balance-sunny',
    majorValue: showSolarPrimary
      ? `${solarForecastToday.value}`
      : `${weather.temperature != null ? weather.temperature : '—'}`,
    majorUnit: showSolarPrimary ? `${solarForecastToday.unit}` : `${weather.unit || ''}`,
    minor: showSolarPrimary ? localize('card.expected_forecast') : weather.condition || '',
  };
}

