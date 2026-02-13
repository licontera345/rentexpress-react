import Button from '../../common/actions/Button';
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  MESSAGES,
} from '../../../constants';
import { t } from '../../../i18n';
import useWeatherPreview from '../../../hooks/misc/useWeatherPreview';
import {
  buildWeatherIconUrl,
  buildWeatherStats
} from '../../../utils/weatherUtils';

// Componente ReservationSummaryWeather que define la interfaz y organiza la lógica de esta vista.

const ReservationSummaryWeather = ({ city, apiKey }) => {
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    canFetch: canFetchWeather,
    helperMessage: weatherHelperMessage,
    fetchWeather
  } = useWeatherPreview({ city, apiKey });
  const weatherIcon = buildWeatherIconUrl(weather?.icon);
  const weatherCondition = weather?.condition || 'neutral';
  const weatherStats = buildWeatherStats(weather);

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
