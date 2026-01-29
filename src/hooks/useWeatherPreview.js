import { useCallback, useMemo, useState } from 'react';
import { t } from '../i18n';

const CACHE_TTL_MS = 10 * 60 * 1000;

const buildCacheKey = (city) => `openweather:${city.toLowerCase()}`;

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

const writeCache = (city, data) => {
  if (!city || typeof window === 'undefined') return;
  try {
    window.sessionStorage?.setItem(
      buildCacheKey(city),
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore cache write errors.
  }
};

const normalizeWeather = (payload) => {
  if (!payload) return null;
  const temp = Number(payload.main?.temp);
  const description = payload.weather?.[0]?.description;
  if (!Number.isFinite(temp) || !description) return null;
  return {
    temp: Math.round(temp),
    description
  };
};

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
    if (!apiKey) return t('WEATHER_PREVIEW_KEY_MISSING');
    if (!city) return t('WEATHER_PREVIEW_CITY_MISSING');
    return '';
  }, [apiKey, city]);

  const fetchWeather = useCallback(async () => {
    if (!city || !apiKey) {
      setError(helperMessage || t('WEATHER_PREVIEW_UNAVAILABLE'));
      return;
    }

    const cached = readCache(city);
    if (cached) {
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
