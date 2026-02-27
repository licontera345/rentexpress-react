import { Card } from '../../common/layout/LayoutPrimitives';
import Button from '../../common/actions/Button';
import { FiSearch, FiMapPin, FiCloud } from 'react-icons/fi';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { t } from '../../../i18n';

function SummaryWeatherBlock({ city, weatherPreview, label }) {
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    canFetch: canFetchWeather,
    helperMessage: weatherHelperMessage,
    fetchWeather,
    weatherEmoji,
    weatherCondition,
    weatherStats
  } = weatherPreview;

  return (
    <div className={`reservation-summary-weather reservation-summary-weather--${weatherCondition}`}>
      <div className="reservation-summary-weather-header">
        <FiCloud size={22} className="reservation-summary-weather-icon-simple" aria-hidden="true" />
        <span>{label || MESSAGES.WEATHER_PREVIEW_TITLE}</span>
        {city && <strong className="reservation-summary-weather-city">{city}</strong>}
      </div>
      <p className="reservation-summary-weather-desc">{MESSAGES.WEATHER_PREVIEW_DESC}</p>
      {weatherHelperMessage && <p className="reservation-summary-weather-helper">{weatherHelperMessage}</p>}
      {weatherError && <p className="reservation-summary-weather-error" role="alert">{weatherError}</p>}
      {weather && (
        <div className="reservation-summary-weather-result">
          <div className="reservation-summary-weather-main">
            {weatherEmoji && (
              <span className="reservation-summary-weather-emoji" aria-hidden="true">
                {weatherEmoji}
              </span>
            )}
            <div>
              <p className="reservation-summary-weather-temp">
                {t('WEATHER_PREVIEW_TEMP_VALUE', { temp: weather.temp })}
              </p>
              <p className="reservation-summary-weather-condition">{weather.description}</p>
            </div>
          </div>
          {weatherStats?.length > 0 && (
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
        <p className="reservation-summary-weather-placeholder">{MESSAGES.WEATHER_PREVIEW_EMPTY}</p>
      )}
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
  summaryView,
  vehicleSearchTerm,
  vehicleOptions,
  pickupLocationSelected,
  isSubmitting,
  vehicleSearchLoading,
  vehicleSearchError,
  onVehicleSearchTermChange,
  onVehicleSelect,
  onSubmit
}) => {
  const {
    pickupLabel,
    returnLabel,
    vehicleTitle,
    vehicleDetails,
    dailyPrice,
    totalEstimate,
    pickupCity,
    returnCity,
    pickupWeatherPreview,
    returnWeatherPreview
  } = summaryView;

  return (
    <Card className="personal-space-card reservation-summary-card">
      <header className="reservation-summary-header">
        <div>
          <h2 className="reservation-summary-title">{MESSAGES.RESERVATION_SUMMARY_TITLE}</h2>
          <p className="reservation-summary-desc">{MESSAGES.RESERVATION_SUMMARY_DESC}</p>
        </div>
      </header>

      <div className="reservation-summary-vehicle">
        <div className="reservation-summary-vehicle-header">
          <h3 className="reservation-summary-vehicle-title">{vehicleTitle}</h3>
          <span className="reservation-summary-vehicle-badge">
            {MESSAGES.RESERVATION_VEHICLE_SEARCH_LABEL}
          </span>
        </div>
        <div className="reservation-summary-search-wrap">
          <FiSearch size={20} className="reservation-summary-search-icon" aria-hidden="true" />
          <input
            id="reservation-vehicle-search"
            type="search"
            value={vehicleSearchTerm}
            onChange={onVehicleSearchTermChange}
            className="reservation-summary-search-input"
            placeholder={MESSAGES.RESERVATION_VEHICLE_SEARCH_PLACEHOLDER}
            disabled={!pickupLocationSelected || isSubmitting || vehicleSearchLoading}
            aria-describedby={!pickupLocationSelected ? 'reservation-vehicle-search-hint' : undefined}
          />
        </div>
        {!pickupLocationSelected && (
          <p id="reservation-vehicle-search-hint" className="reservation-summary-search-feedback reservation-summary-search-feedback--hint">
            {MESSAGES.RESERVATION_VEHICLE_SEARCH_SELECT_PICKUP_FIRST}
          </p>
        )}

        {vehicleSearchLoading && (
          <p className="reservation-summary-search-feedback">{MESSAGES.STARTING}</p>
        )}
        {!vehicleSearchLoading && vehicleSearchError && (
          <p className="reservation-summary-search-feedback reservation-summary-search-feedback--error">
            {vehicleSearchError}
          </p>
        )}
        {!vehicleSearchLoading && !vehicleSearchError && vehicleOptions.length === 0 && (
          <p className="reservation-summary-search-feedback">{MESSAGES.RESERVATION_VEHICLE_NO_RESULTS}</p>
        )}

        {!vehicleSearchLoading && !vehicleSearchError && vehicleOptions.length > 0 && (
          <div
            className="reservation-summary-search-results"
            role="list"
            aria-label={MESSAGES.RESERVATION_VEHICLE_SEARCH_LABEL}
          >
            {vehicleOptions.slice(0, 5).map((vehicle) => {
              const vehicleName =
                vehicle.brand && vehicle.model
                  ? `${vehicle.brand} ${vehicle.model}`
                  : MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK;
              return (
                <button
                  type="button"
                  key={vehicle.vehicleId}
                  onClick={() => onVehicleSelect(vehicle)}
                  className={`reservation-summary-search-option${vehicle.selected ? ' is-selected' : ''}`}
                  disabled={isSubmitting}
                >
                  <span>{vehicleName}</span>
                  <small>{vehicle.licensePlate || MESSAGES.NOT_AVAILABLE_SHORT}</small>
                </button>
              );
            })}
          </div>
        )}

        {vehicleDetails && <p className="reservation-summary-vehicle-details">{vehicleDetails}</p>}
      </div>

      <div className="reservation-summary-details">
        <div className="reservation-summary-row reservation-summary-row--location">
          <span className="reservation-summary-row-label">
            <FiMapPin size={14} className="reservation-summary-row-icon" aria-hidden="true" />
            {MESSAGES.RESERVATION_PICKUP_SECTION}
          </span>
          <strong>{pickupLabel}</strong>
        </div>
        <div className="reservation-summary-row reservation-summary-row--location">
          <span className="reservation-summary-row-label">
            <FiMapPin size={14} className="reservation-summary-row-icon" aria-hidden="true" />
            {MESSAGES.RESERVATION_RETURN_SECTION}
          </span>
          <strong>{returnLabel}</strong>
        </div>
        <div className="reservation-summary-row reservation-summary-row--price">
          <span>{MESSAGES.DAILY_PRICE}</span>
          <strong className="reservation-summary-price">{dailyPrice || MESSAGES.RESERVATION_SUMMARY_TOTAL_PLACEHOLDER}</strong>
        </div>
      </div>

      <div className="reservation-summary-total">
        <div className="reservation-summary-row">
          <span>{MESSAGES.RESERVATION_SUMMARY_TOTAL}</span>
          <strong className="reservation-summary-price">{totalEstimate || MESSAGES.RESERVATION_SUMMARY_TOTAL_PLACEHOLDER}</strong>
        </div>
      </div>

      {pickupWeatherPreview && (
        <SummaryWeatherBlock
          city={pickupCity}
          weatherPreview={pickupWeatherPreview}
          label={MESSAGES.WEATHER_PICKUP_LABEL}
        />
      )}

      {returnWeatherPreview && (
        <SummaryWeatherBlock
          city={returnCity}
          weatherPreview={returnWeatherPreview}
          label={MESSAGES.WEATHER_RETURN_LABEL}
        />
      )}

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
