import Card from '../../common/layout/Card';
import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES, OPENWEATHER_API_KEY } from '../../../constants';
import { t } from '../../../i18n';
import { formatCurrency } from '../../../utils/formatters';
import { findHeadquartersById, getHeadquartersLabel } from '../../../utils/headquartersUtils';
import {
  buildVehicleDetails,
  calculateDurationDays,
  getWeatherCityFromHeadquarters,
  calculateReservationTotal,
  isVehicleSelected
} from '../../../utils/reservationSummaryUtils';
import { buildWeatherIconUrl, buildWeatherStats } from '../../../utils/weatherUtils';
import { buildVehicleTitle } from '../../../utils/vehicleUtils';
import useWeatherPreview from '../../../hooks/misc/useWeatherPreview';

function SummaryWeatherBlock({ city, apiKey }) {
  const { weather, loading: weatherLoading, error: weatherError, canFetch: canFetchWeather, helperMessage: weatherHelperMessage, fetchWeather } = useWeatherPreview({ city, apiKey });
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
      {weatherHelperMessage && <p className="reservation-summary-weather-helper">{weatherHelperMessage}</p>}
      {weatherError && <p className="reservation-summary-weather-error" role="alert">{weatherError}</p>}
      {weather && (
        <div className="reservation-summary-weather-result">
          <div className="reservation-summary-weather-main">
            {weatherIcon && <img className="reservation-summary-weather-icon" src={weatherIcon} alt={weather.description} loading="lazy" />}
            <div>
              <p className="reservation-summary-weather-temp">{t('WEATHER_PREVIEW_TEMP_VALUE', { temp: weather.temp })}</p>
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
      {!weather && !weatherError && !weatherLoading && <p className="reservation-summary-weather-placeholder">{MESSAGES.WEATHER_PREVIEW_EMPTY}</p>}
      <Button
        type="button"
        variant={BUTTON_VARIANTS.OUTLINED}
        size={BUTTON_SIZES.MEDIUM}
        className="reservation-summary-weather-action"
        disabled={weatherLoading || !canFetchWeather}
        onClick={fetchWeather}
      >
        {weatherLoading ? MESSAGES.WEATHER_PREVIEW_LOADING : MESSAGES.WEATHER_PREVIEW_BUTTON}
      </Button>
    </div>
  );
}

const ReservationCreateSummary = ({
  formData,
  headquarters,
  vehicleSummary,
  vehicleSearchTerm,
  vehicleOptions,
  vehicleSearchLoading,
  vehicleSearchError,
  isSubmitting,
  onVehicleSearchTermChange,
  onVehicleSelect,
  onSubmit
}) => {
  const apiKey = OPENWEATHER_API_KEY;
  const pickupHeadquarters = findHeadquartersById(headquarters, formData.pickupHeadquartersId);
  const returnHeadquarters = findHeadquartersById(headquarters, formData.returnHeadquartersId);
  const pickupLabel = getHeadquartersLabel(pickupHeadquarters);
  const returnLabel = getHeadquartersLabel(returnHeadquarters);
  const weatherCity = getWeatherCityFromHeadquarters(pickupHeadquarters, returnHeadquarters);

  const vehicleTitle = buildVehicleTitle(vehicleSummary, { fallback: MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK });
  const vehicleDetails = buildVehicleDetails({
    plate: vehicleSummary?.licensePlate,
    year: vehicleSummary?.manufactureYear,
    mileage: vehicleSummary?.currentMileage
  });

  const dailyPrice = formatCurrency(formData.dailyPrice);
  const durationDays = calculateDurationDays(
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime
  );
  const totalEstimate = calculateReservationTotal(formData.dailyPrice, durationDays);

  return (
    <Card className="personal-space-card reservation-summary-card">
      <header className="reservation-summary-header">
        <div>
          <h2>{MESSAGES.RESERVATION_SUMMARY_TITLE}</h2>
          <p>{MESSAGES.RESERVATION_SUMMARY_DESC}</p>
        </div>
      </header>

      <div className="reservation-summary-vehicle">
        <div className="reservation-summary-vehicle-header">
          <h3>{vehicleTitle}</h3>
          <span className="reservation-summary-vehicle-badge">{MESSAGES.RESERVATION_VEHICLE_SEARCH_LABEL}</span>
        </div>
        <label htmlFor="reservation-vehicle-search" className="reservation-summary-search-label">
          {MESSAGES.RESERVATION_VEHICLE_SEARCH_PLACEHOLDER}
        </label>
        <input
          id="reservation-vehicle-search"
          type="search"
          value={vehicleSearchTerm}
          onChange={onVehicleSearchTermChange}
          className="reservation-summary-search-input"
          placeholder={MESSAGES.RESERVATION_VEHICLE_SEARCH_PLACEHOLDER}
          disabled={isSubmitting || vehicleSearchLoading}
        />

        {vehicleSearchLoading && (
          <p className="reservation-summary-search-feedback">{MESSAGES.STARTING}</p>
        )}
        {!vehicleSearchLoading && vehicleSearchError && (
          <p className="reservation-summary-search-feedback reservation-summary-search-feedback--error">{vehicleSearchError}</p>
        )}
        {!vehicleSearchLoading && !vehicleSearchError && vehicleOptions.length === 0 && (
          <p className="reservation-summary-search-feedback">{MESSAGES.RESERVATION_VEHICLE_NO_RESULTS}</p>
        )}

        {!vehicleSearchLoading && !vehicleSearchError && vehicleOptions.length > 0 && (
          <div className="reservation-summary-search-results" role="list" aria-label={MESSAGES.RESERVATION_VEHICLE_SEARCH_LABEL}>
            {vehicleOptions.slice(0, 5).map((vehicle) => {
              const selected = isVehicleSelected(vehicle.vehicleId, formData.vehicleId);
              const vehicleName = buildVehicleTitle(vehicle, { fallback: MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK });
              return (
                <button
                  type="button"
                  key={vehicle.vehicleId}
                  onClick={() => onVehicleSelect(vehicle)}
                  className={`reservation-summary-search-option${selected ? ' is-selected' : ''}`}
                  disabled={isSubmitting}
                >
                  <span>{vehicleName}</span>
                  <small>{vehicle.licensePlate || MESSAGES.NOT_AVAILABLE_SHORT}</small>
                </button>
              );
            })}
          </div>
        )}

        {vehicleDetails && <p>{vehicleDetails}</p>}
      </div>

      <div className="reservation-summary-details">
        <div className="reservation-summary-row">
          <span>{MESSAGES.RESERVATION_PICKUP_SECTION}</span>
          <strong>{pickupLabel}</strong>
        </div>
        <div className="reservation-summary-row">
          <span>{MESSAGES.RESERVATION_RETURN_SECTION}</span>
          <strong>{returnLabel}</strong>
        </div>
        <div className="reservation-summary-row">
          <span>{MESSAGES.DAILY_PRICE}</span>
          <strong>{dailyPrice || MESSAGES.RESERVATION_SUMMARY_TOTAL_PLACEHOLDER}</strong>
        </div>
      </div>

      <div className="reservation-summary-total">
        <div className="reservation-summary-row">
          <span>{MESSAGES.RESERVATION_SUMMARY_TOTAL}</span>
          <strong>{totalEstimate || MESSAGES.RESERVATION_SUMMARY_TOTAL_PLACEHOLDER}</strong>
        </div>
      </div>

      <SummaryWeatherBlock city={weatherCity} apiKey={apiKey} />

      <Button
        type="button"
        variant={BUTTON_VARIANTS.PRIMARY}
        size={BUTTON_SIZES.LARGE}
        className="reservation-summary-action"
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? MESSAGES.STARTING : MESSAGES.RESERVE}
      </Button>

      <p className="reservation-summary-note">{MESSAGES.RESERVATION_SUMMARY_NOTE}</p>
    </Card>
  );
};

export default ReservationCreateSummary;
