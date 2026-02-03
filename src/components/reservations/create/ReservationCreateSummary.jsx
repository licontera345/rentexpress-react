import Card from '../../common/layout/Card';
import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES, OPENWEATHER_API_KEY } from '../../../constants';
import { getHeadquartersCityName, getHeadquartersOptionLabel } from '../../../config/headquartersLabels';
import { formatCurrency } from '../../../utils/formatters';
import ReservationSummaryWeather from './ReservationSummaryWeather';
import { buildVehicleDetails, calculateDurationDays } from './reservationSummaryUtils';

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

      <ReservationSummaryWeather city={weatherCity} apiKey={apiKey} />

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
