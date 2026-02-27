import { useCallback, useMemo, useState } from 'react';
import { t } from '../../i18n';
import WeatherService from '../../api/services/WeatherService';
import { readWeatherCache, writeWeatherCache, normalizeProxyWeatherResponse } from '../../utils/weather/weatherUtils';

const useWeatherPreview = ({ city, lang = 'es' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canFetch = Boolean(city);

  const helperMessage = useMemo(() => {
    if (!city) return t('WEATHER_PREVIEW_CITY_MISSING');
    return '';
  }, [city]);

  const fetchWeather = useCallback(async () => {
    if (!city) {
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
      const payload = await WeatherService.getByCity(city, lang);
      const normalized = normalizeProxyWeatherResponse(payload);
      if (!normalized) throw new Error(t('WEATHER_PREVIEW_ERROR'));

      writeWeatherCache(city, normalized);
      setWeather(normalized);
    } catch (err) {
      const message = err?.message || t('WEATHER_PREVIEW_ERROR');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [city, helperMessage, lang]);

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
