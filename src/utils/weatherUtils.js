import { t } from '../i18n';
import { DISTANCE_UNIT_KM, WEATHER_UNITS } from '../constants';

// --- Cache y normalización (usados por useWeatherPreview) ---

const CACHE_TTL_MS = 10 * 60 * 1000;

const buildCacheKey = (city) => `openweather:${city?.toLowerCase() || ''}`;

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

const resolveCondition = (value) => {
  if (!value) return 'neutral';
  const n = String(value).toLowerCase();
  if (n.includes('clear')) return 'clear';
  if (n.includes('cloud')) return 'clouds';
  if (n.includes('rain')) return 'rain';
  if (n.includes('drizzle')) return 'drizzle';
  if (n.includes('thunder')) return 'storm';
  if (n.includes('snow')) return 'snow';
  if (/mist|fog|haze|smoke|dust|sand|ash|squall|tornado/.test(n)) return 'atmosphere';
  return 'neutral';
};

export const normalizeWeatherResponse = (payload) => {
  if (!payload) return null;
  const temp = Number(payload.main?.temp);
  const description = payload.weather?.[0]?.description;
  if (!Number.isFinite(temp) || !description) return null;
  const main = payload.weather?.[0]?.main || '';
  return {
    temp: Math.round(temp),
    description,
    feelsLike: Number.isFinite(payload.main?.feels_like) ? Math.round(payload.main.feels_like) : null,
    humidity: Number.isFinite(payload.main?.humidity) ? payload.main.humidity : null,
    pressure: Number.isFinite(payload.main?.pressure) ? payload.main.pressure : null,
    windSpeed: Number.isFinite(payload.wind?.speed) ? payload.wind.speed : null,
    windDeg: Number.isFinite(payload.wind?.deg) ? payload.wind.deg : null,
    visibility: Number.isFinite(payload.visibility) ? payload.visibility : null,
    icon: payload.weather?.[0]?.icon || '',
    main,
    condition: resolveCondition(main)
  };
};

// --- Formato para UI ---

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
