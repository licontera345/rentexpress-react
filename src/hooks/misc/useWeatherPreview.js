import { useCallback, useMemo, useState } from 'react';
import { t } from '../../i18n';
import { readWeatherCache, writeWeatherCache, normalizeWeatherResponse } from '../../utils/weatherUtils';

const FETCH_TIMEOUT_MS = 10 * 1000;

/**
 * Hook para previsualizar el clima de una ciudad.
 * Usa cache en sessionStorage y normaliza la respuesta de OpenWeather.
 */
const useWeatherPreview = ({ city, apiKey, units = 'metric', lang = 'es' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canFetch = Boolean(city && apiKey);

  // Mensaje de ayuda para el usuario.
  const helperMessage = useMemo(() => {
    if (!apiKey) return t('WEATHER_PREVIEW_KEY_MISSING');
    if (!city) return t('WEATHER_PREVIEW_CITY_MISSING');
    return '';
  }, [apiKey, city]);

  // Obtiene el clima de la ciudad.
  const fetchWeather = useCallback(async () => {
    if (!city || !apiKey) {
      setError(helperMessage || t('WEATHER_PREVIEW_UNAVAILABLE'));
      return;
    }

    const cached = readWeatherCache(city);
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const response = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(t('WEATHER_PREVIEW_ERROR'));

      const payload = await response.json();
      const normalized = normalizeWeatherResponse(payload);
      if (!normalized) throw new Error(t('WEATHER_PREVIEW_ERROR'));

      writeWeatherCache(city, normalized);
      setWeather(normalized);
    } catch (err) {
      const isAbort = err?.name === 'AbortError';
      const isNetwork = err?.message === 'Failed to fetch' || err?.message?.includes('fetch');
      const message = isAbort || isNetwork
        ? t('WEATHER_PREVIEW_NETWORK_ERROR')
        : (err?.message || t('WEATHER_PREVIEW_ERROR'));
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, city, helperMessage, lang, units]);

  // Limpia el clima.
  const clearWeather = useCallback(() => {
    setWeather(null);
    setError('');
  }, []);

  // Estado y callbacks para el hook.
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
