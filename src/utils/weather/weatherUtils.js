import { t } from '../../i18n';
import { DISTANCE_UNIT_KM, WEATHER_UNITS } from '../../constants';

// --- Cache (usados por useWeatherPreview) ---

const CACHE_TTL_MS = 10 * 60 * 1000;

const buildCacheKey = (city) => `weather:${city?.toLowerCase() || ''}`;

export const readWeatherCache = (city) => {
  if (!city || typeof window === 'undefined') return null;
  const raw = window.sessionStorage?.getItem(buildCacheKey(city));
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw);
    if (!cached?.timestamp || !cached?.data) return null;
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) return null;
    return cached.data;
  } catch {
    return null;
  }
};

export const writeWeatherCache = (city, data) => {
  if (!city || typeof window === 'undefined') return;
  try {
    window.sessionStorage?.setItem(
      buildCacheKey(city),
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignora errores de escritura del cache.
  }
};

// --- Mapeo de icon code a emoji (sin exponer proveedor) ---

const WEATHER_ICON_MAP = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export const getWeatherEmoji = (iconCode) => WEATHER_ICON_MAP[iconCode] || '🌡️';

const resolveConditionFromIcon = (iconCode) => {
  if (!iconCode) return 'neutral';
  const prefix = iconCode.substring(0, 2);
  const map = {
    '01': 'clear', '02': 'clouds', '03': 'clouds', '04': 'clouds',
    '09': 'rain', '10': 'rain', '11': 'storm', '13': 'snow', '50': 'atmosphere',
  };
  return map[prefix] || 'neutral';
};

export const normalizeProxyWeatherResponse = (payload) => {
  if (!payload) return null;
  const temp = Number(payload.temp);
  if (!Number.isFinite(temp) || !payload.description) return null;

  return {
    temp: Math.round(temp),
    tempMin: Number.isFinite(payload.tempMin) ? Math.round(payload.tempMin) : null,
    tempMax: Number.isFinite(payload.tempMax) ? Math.round(payload.tempMax) : null,
    description: payload.description,
    humidity: Number.isFinite(payload.humidity) ? payload.humidity : null,
    icon: payload.icon || '',
    emoji: getWeatherEmoji(payload.icon),
    condition: resolveConditionFromIcon(payload.icon),
    city: payload.city || '',
  };
};

export const normalizeWeatherResponse = normalizeProxyWeatherResponse;

// --- Formato para UI ---

export const buildWeatherIconUrl = (icon) => {
  if (!icon) return '';
  return '';
};

export const convertVisibilityToKm = (visibility) => {
  if (!visibility) return null;
  return (visibility / 1000).toFixed(1);
};

export const buildWindLabel = (windSpeed, windDeg) => {
  if (windSpeed === null || windSpeed === undefined) return null;
  if (windDeg !== null && windDeg !== undefined) {
    return `${windSpeed} ${WEATHER_UNITS.WIND_SPEED} · ${windDeg}°`;
  }
  return `${windSpeed} ${WEATHER_UNITS.WIND_SPEED}`;
};

export const buildWeatherStats = (weather) => {
  if (!weather) return [];
  const stats = [];

  if (weather.tempMin !== null && weather.tempMax !== null) {
    stats.push({
      label: t('WEATHER_PREVIEW_TEMP_RANGE'),
      value: `${weather.tempMin}° / ${weather.tempMax}°`
    });
  }

  if (weather.humidity !== null && weather.humidity !== undefined) {
    stats.push({
      label: t('WEATHER_PREVIEW_HUMIDITY'),
      value: `${weather.humidity}%`
    });
  }

  return stats;
};
