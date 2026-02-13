import { t } from '../i18n';
import { DISTANCE_UNIT_KM, WEATHER_UNITS } from '../constants';

// Construye la URL del icono del clima.
export const buildWeatherIconUrl = (icon) => {
  if (!icon) return '';
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

// Convierte la visibilidad de metros a kilómetros.
export const convertVisibilityToKm = (visibility) => {
  if (!visibility) return null;
  return (visibility / 1000).toFixed(1);
};

// Construye la etiqueta del viento.
export const buildWindLabel = (windSpeed, windDeg) => {
  if (windSpeed === null || windSpeed === undefined) return null;
  
  if (windDeg !== null && windDeg !== undefined) {
    return `${windSpeed} ${WEATHER_UNITS.WIND_SPEED} · ${windDeg}°`;
  }
  
  return `${windSpeed} ${WEATHER_UNITS.WIND_SPEED}`;
};

// Construye las estadísticas del clima para mostrar.
export const buildWeatherStats = (weather) => {
  if (!weather) return [];

  const stats = [];

  if (weather.feelsLike !== null && weather.feelsLike !== undefined) {
    stats.push({
      label: t('WEATHER_PREVIEW_FEELS_LIKE'),
      value: t('WEATHER_PREVIEW_TEMP_VALUE', { temp: weather.feelsLike })
    });
  }

  const windLabel = buildWindLabel(weather.windSpeed, weather.windDeg);
  if (windLabel) {
    stats.push({
      label: t('WEATHER_PREVIEW_WIND'),
      value: windLabel
    });
  }

  if (weather.humidity !== null && weather.humidity !== undefined) {
    stats.push({
      label: t('WEATHER_PREVIEW_HUMIDITY'),
      value: `${weather.humidity}%`
    });
  }

  if (weather.pressure !== null && weather.pressure !== undefined) {
    stats.push({
      label: t('WEATHER_PREVIEW_PRESSURE'),
      value: `${weather.pressure} ${WEATHER_UNITS.PRESSURE}`
    });
  }

  const visibilityKm = convertVisibilityToKm(weather.visibility);
  if (visibilityKm) {
    stats.push({
      label: t('WEATHER_PREVIEW_VISIBILITY'),
      value: `${visibilityKm} ${DISTANCE_UNIT_KM}`
    });
  }

  return stats;
};
