import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';
import useWeatherPreview from '../../../hooks/useWeatherPreview';

// Componente Reservation Summary Weather que encapsula la interfaz y la lógica principal de esta sección.

const ReservationSummaryWeather = ({ city, apiKey }) => {
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    canFetch: canFetchWeather,
    helperMessage: weatherHelperMessage,
    fetchWeather
  } = useWeatherPreview({ city, apiKey });
  const weatherIcon = weather?.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : '';
  const weatherCondition = weather?.condition || 'neutral';
  const visibilityKm = weather?.visibility ? (weather.visibility / 1000).toFixed(1) : null;
  const windLabel = weather?.windSpeed !== null && weather?.windSpeed !== undefined
    ? weather.windDeg !== null && weather.windDeg !== undefined
      ? `${weather.windSpeed} m/s · ${weather.windDeg}°`
      : `${weather.windSpeed} m/s`
    : null;
  const weatherStats = [
    weather?.feelsLike !== null && weather?.feelsLike !== undefined
      ? {
        label: t('WEATHER_PREVIEW_FEELS_LIKE'),
        value: t('WEATHER_PREVIEW_TEMP_VALUE', { temp: weather.feelsLike })
      }
      : null,
    windLabel
      ? {
        label: t('WEATHER_PREVIEW_WIND'),
        value: windLabel
      }
      : null,
    weather?.humidity !== null && weather?.humidity !== undefined
      ? {
        label: t('WEATHER_PREVIEW_HUMIDITY'),
        value: `${weather.humidity}%`
      }
      : null,
    weather?.pressure !== null && weather?.pressure !== undefined
      ? {
        label: t('WEATHER_PREVIEW_PRESSURE'),
        value: `${weather.pressure} hPa`
      }
      : null,
    visibilityKm
      ? {
        label: t('WEATHER_PREVIEW_VISIBILITY'),
        value: `${visibilityKm} km`
      }
      : null
  ].filter(Boolean);

  return (
    <div className={`reservation-summary-weather reservation-summary-weather--${weatherCondition}`}>
      <div className="reservation-summary-row">
        <span>{MESSAGES.WEATHER_PREVIEW_TITLE}</span>
        <strong>{city || MESSAGES.NOT_AVAILABLE_SHORT}</strong>
      </div>
      <p className="reservation-summary-weather-desc">{MESSAGES.WEATHER_PREVIEW_DESC}</p>

      {weatherHelperMessage && (
        <p className="reservation-summary-weather-helper">{weatherHelperMessage}</p>
      )}

      {weatherError && (
        <p className="reservation-summary-weather-error" role="alert">
          {weatherError}
        </p>
      )}

      {weather && (
        <div className="reservation-summary-weather-result">
          <div className="reservation-summary-weather-main">
            {weatherIcon && (
              <img
                className="reservation-summary-weather-icon"
                src={weatherIcon}
                alt={weather.description}
                loading="lazy"
              />
            )}
            <div>
              <p className="reservation-summary-weather-temp">
                {t('WEATHER_PREVIEW_TEMP_VALUE', { temp: weather.temp })}
              </p>
              <p className="reservation-summary-weather-condition">{weather.description}</p>
            </div>
          </div>
          {weatherStats.length > 0 && (
            <div className="reservation-summary-weather-stats">
              {weatherStats.map((stat) => (
                <div key={stat.label} className="reservation-summary-weather-stat">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!weather && !weatherError && !weatherLoading && (
        <p className="reservation-summary-weather-placeholder">
          {MESSAGES.WEATHER_PREVIEW_EMPTY}
        </p>
      )}

      <Button
        type="button"
        variant={BUTTON_VARIANTS.OUTLINE}
        size={BUTTON_SIZES.MEDIUM}
        className="reservation-summary-weather-action"
        disabled={weatherLoading || !canFetchWeather}
        onClick={fetchWeather}
      >
        {weatherLoading ? MESSAGES.WEATHER_PREVIEW_LOADING : MESSAGES.WEATHER_PREVIEW_BUTTON}
      </Button>
    </div>
  );
};

export default ReservationSummaryWeather;
