import { useCallback, useMemo, useState } from 'react';
import { t } from '../../i18n';

/**
 * Hook para previsualizar el clima de una ciudad.
 * Normaliza respuesta, maneja cache en sessionStorage y expone helpers de consulta.
 */
// Tiempo de vida del cache en sessionStorage (10 minutos).
const CACHE_TTL_MS = 10 * 60 * 1000;

// Clave de cache por ciudad para evitar conflictos.
const buildCacheKey = (city) => `openweather:${city.toLowerCase()}`;

// Lee cache local y valida vencimiento.
const readCache = (city) => {
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

// Escribe datos de clima en cache de sesión.
const writeCache = (city, data) => {
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

// Normaliza una condición general para mapear estados del clima.
const resolveCondition = (value) => {
  if (!value) return 'neutral';
  const normalized = value.toLowerCase();
  if (normalized.includes('clear')) return 'clear';
  if (normalized.includes('cloud')) return 'clouds';
  if (normalized.includes('rain')) return 'rain';
  if (normalized.includes('drizzle')) return 'drizzle';
  if (normalized.includes('thunder')) return 'storm';
  if (normalized.includes('snow')) return 'snow';
  if (
    normalized.includes('mist') ||
    normalized.includes('fog') ||
    normalized.includes('haze') ||
    normalized.includes('smoke') ||
    normalized.includes('dust') ||
    normalized.includes('sand') ||
    normalized.includes('ash') ||
    normalized.includes('squall') ||
    normalized.includes('tornado')
  ) {
    return 'atmosphere';
  }
  return 'neutral';
};

// Normaliza la respuesta de la API a un formato amigable para UI.
const normalizeWeather = (payload) => {
  if (!payload) return null;
  const temp = Number(payload.main?.temp);
  const description = payload.weather?.[0]?.description;
  if (!Number.isFinite(temp) || !description) return null;
  const feelsLike = Number(payload.main?.feels_like);
  const humidity = Number(payload.main?.humidity);
  const pressure = Number(payload.main?.pressure);
  const windSpeed = Number(payload.wind?.speed);
  const windDeg = Number(payload.wind?.deg);
  const visibility = Number(payload.visibility);
  const icon = payload.weather?.[0]?.icon || '';
  const main = payload.weather?.[0]?.main || '';
  return {
    temp: Math.round(temp),
    description,
    feelsLike: Number.isFinite(feelsLike) ? Math.round(feelsLike) : null,
    humidity: Number.isFinite(humidity) ? humidity : null,
    pressure: Number.isFinite(pressure) ? pressure : null,
    windSpeed: Number.isFinite(windSpeed) ? windSpeed : null,
    windDeg: Number.isFinite(windDeg) ? windDeg : null,
    visibility: Number.isFinite(visibility) ? visibility : null,
    icon,
    main,
    condition: resolveCondition(main)
  };
};

// Hook que consulta el clima y usa cache para evitar llamadas repetidas.
const useWeatherPreview = ({
  city,
  apiKey,
  units = 'metric',
  lang = 'es'
}) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canFetch = Boolean(city && apiKey);

  const helperMessage = useMemo(() => {
    // Mensaje de ayuda si falta clave o ciudad.
    if (!apiKey) return t('WEATHER_PREVIEW_KEY_MISSING');
    if (!city) return t('WEATHER_PREVIEW_CITY_MISSING');
    return '';
  }, [apiKey, city]);

  const fetchWeather = useCallback(async () => {
    // Ejecuta la consulta al servicio externo y actualiza estado.
    if (!city || !apiKey) {
      setError(helperMessage || t('WEATHER_PREVIEW_UNAVAILABLE'));
      return;
    }

    const cached = readCache(city);
    if (cached) {
      // Usa cache si está vigente.
      setWeather(cached);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = new URL('https://api.openweathermap.org/data/2.5/weather');
      url.searchParams.set('q', city);
      url.searchParams.set('appid', apiKey);
      url.searchParams.set('units', units);
      url.searchParams.set('lang', lang);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(t('WEATHER_PREVIEW_ERROR'));
      }

      const payload = await response.json();
      const normalized = normalizeWeather(payload);
      if (!normalized) {
        throw new Error(t('WEATHER_PREVIEW_ERROR'));
      }

      // Guarda cache y actualiza datos normalizados.
      writeCache(city, normalized);
      setWeather(normalized);
    } catch (err) {
      setError(err?.message || t('WEATHER_PREVIEW_ERROR'));
    } finally {
      setLoading(false);
    }
  }, [apiKey, city, helperMessage, lang, units]);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setError('');
  }, []);

  return {
    weather,
    loading,
    error,
    canFetch,
    helperMessage,
    fetchWeather,
    clearWeather
  };
};

export default useWeatherPreview;
