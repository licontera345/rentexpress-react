import { MESSAGES } from '../../constants';
import { getHeadquartersOptionLabel } from '../../utils/headquartersLabels';

const normalizeEntity = (value) => (Array.isArray(value) ? value[0] : value);

const formatDate = (value) => {
  if (!value) return MESSAGES.NOT_AVAILABLE_SHORT;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return MESSAGES.NOT_AVAILABLE_SHORT;
  }
  return date.toLocaleDateString();
};

const resolveVehicleLabel = (reservation) => {
  const vehicle = normalizeEntity(reservation?.vehicle);
  const brand = vehicle?.brand || reservation?.brand;
  const model = vehicle?.model || reservation?.model;
  const plate = vehicle?.licensePlate || reservation?.licensePlate;
  if (brand || model) {
    const label = `${brand || ''} ${model || ''}`.trim();
    return plate ? `${label} · ${plate}` : label;
  }
  if (plate) {
    return plate;
  }
  if (reservation?.vehicleId) {
    return `${MESSAGES.RESERVATION_VEHICLE_ID}: ${reservation.vehicleId}`;
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

const resolveStatusLabel = (reservation) => (
  reservation?.reservationStatus?.statusName
  || reservation?.reservationStatusName
  || reservation?.statusName
  || MESSAGES.NOT_AVAILABLE_SHORT
);

const resolveHeadquartersLabel = (headquarters) => {
  const normalized = normalizeEntity(headquarters);
  if (!normalized) return MESSAGES.NOT_AVAILABLE_SHORT;
  const label = getHeadquartersOptionLabel(normalized);
  return label || MESSAGES.NOT_AVAILABLE_SHORT;
};

const ReservationListItem = ({ reservation }) => {
  const reservationId = reservation?.reservationId || reservation?.id || MESSAGES.NOT_AVAILABLE_SHORT;
  const vehicleLabel = resolveVehicleLabel(reservation);
  const statusLabel = resolveStatusLabel(reservation);
  const pickupLabel = resolveHeadquartersLabel(reservation?.pickupHeadquarters);
  const returnLabel = resolveHeadquartersLabel(reservation?.returnHeadquarters);

  return (
    <article className="vehicle-list-item reservation-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{MESSAGES.RESERVATION_REFERENCE} #{reservationId}</h3>
          <p className="item-plate">{vehicleLabel}</p>
        </div>
        <span className="item-status status-unknown">{statusLabel}</span>
      </div>
      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.PICKUP_DATE}</span>
          <span className="detail-value">{formatDate(reservation?.startDate)}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.RETURN_DATE}</span>
          <span className="detail-value">{formatDate(reservation?.endDate)}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.PICKUP_LOCATION}</span>
          <span className="detail-value">{pickupLabel}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.RETURN_LOCATION}</span>
          <span className="detail-value">{returnLabel}</span>
        </div>
      </div>
    </article>
  );
};

export default ReservationListItem;
