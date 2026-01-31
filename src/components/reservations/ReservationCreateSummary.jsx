import Card from '../common/layout/Card';
import Button from '../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES, OPENWEATHER_API_KEY } from '../../constants';
import { t } from '../../i18n';
import useWeatherPreview from '../../hooks/useWeatherPreview';
import { getHeadquartersCityName, getHeadquartersOptionLabel } from '../../utils/headquartersLabels';

const NUMBER_FORMAT_LOCALE = 'es-ES';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;

  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE, {
    style: 'currency',
    currency: 'EUR'
  }).format(numeric);
};

const buildReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return null;
  const normalizedTime = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  const composed = `${dateValue}T${normalizedTime}:00`;
  const parsed = new Date(composed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const calculateDurationDays = (startDate, startTime, endDate, endTime) => {
  const start = buildReservationDateTime(startDate, startTime);
  const end = buildReservationDateTime(endDate, endTime);
  if (!start || !end || end < start) return null;
  const diffMs = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffMs / MS_PER_DAY));
};

const buildVehicleDetails = ({ plate, year, mileage }) => {
  const parts = [];
  if (plate) {
    parts.push(t('RESERVATION_SUMMARY_PLATE', { plate }));
  }
  if (year) {
    parts.push(t('RESERVATION_SUMMARY_YEAR', { year }));
  }
  if (mileage !== null && mileage !== undefined && mileage !== '') {
    parts.push(t('RESERVATION_SUMMARY_MILEAGE', { mileage }));
  }
  return parts.join(' · ');
};

const ReservationCreateSummary = ({
  formData,
  headquarters,
  vehicleSummary,
  isSubmitting,
  onSubmit
}) => {
  const apiKey = OPENWEATHER_API_KEY;
  const pickupHeadquarters = headquarters.find(
    (hq) => String(hq.headquartersId ?? hq.id) === String(formData.pickupHeadquartersId)
  );
  const returnHeadquarters = headquarters.find(
    (hq) => String(hq.headquartersId ?? hq.id) === String(formData.returnHeadquartersId)
  );
  const pickupLabel = pickupHeadquarters
    ? getHeadquartersOptionLabel(pickupHeadquarters)
    : MESSAGES.NOT_AVAILABLE_SHORT;
  const returnLabel = returnHeadquarters
    ? getHeadquartersOptionLabel(returnHeadquarters)
    : MESSAGES.NOT_AVAILABLE_SHORT;
  const weatherCity = getHeadquartersCityName(pickupHeadquarters || returnHeadquarters);
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    canFetch: canFetchWeather,
    helperMessage: weatherHelperMessage,
    fetchWeather
  } = useWeatherPreview({ city: weatherCity, apiKey });

  const vehicleTitle = [vehicleSummary?.brand, vehicleSummary?.model].filter(Boolean).join(' ')
    || MESSAGES.RESERVATION_SUMMARY_VEHICLE_FALLBACK;
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
  const totalEstimate = durationDays && dailyPrice
    ? formatCurrency(Number(formData.dailyPrice) * durationDays)
    : null;

  return (
    <Card className="personal-space-card reservation-summary-card">
      <header className="reservation-summary-header">
        <div>
          <h2>{MESSAGES.RESERVATION_SUMMARY_TITLE}</h2>
          <p>{MESSAGES.RESERVATION_SUMMARY_DESC}</p>
        </div>
      </header>

      <div className="reservation-summary-vehicle">
        <h3>{vehicleTitle}</h3>
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

      <div className="reservation-summary-weather">
        <div className="reservation-summary-row">
          <span>{MESSAGES.WEATHER_PREVIEW_TITLE}</span>
          <strong>{weatherCity || MESSAGES.NOT_AVAILABLE_SHORT}</strong>
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
          <p className="reservation-summary-weather-result">
            {t('WEATHER_PREVIEW_RESULT', {
              temp: weather.temp,
              description: weather.description
            })}
          </p>
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
