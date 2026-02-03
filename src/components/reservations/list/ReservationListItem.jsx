import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { getHeadquartersAddressLabel, getHeadquartersNameLabel } from '../../../config/headquartersLabels';
import { normalize } from '../../../utils/entityNormalizers';

const formatDate = (value) => {
  if (!value) return MESSAGES.NOT_AVAILABLE_SHORT;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return MESSAGES.NOT_AVAILABLE_SHORT;
  }
  return date.toLocaleDateString();
};

const resolveVehicleLabel = (reservation) => {
  const vehicle = normalize(reservation?.vehicle);
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

const resolveHeadquartersDetails = (headquarters) => {
  const normalized = normalize(headquarters);
  if (!normalized) {
    return { name: MESSAGES.NOT_AVAILABLE_SHORT, address: '' };
  }
  const name = getHeadquartersNameLabel(normalized);
  const address = getHeadquartersAddressLabel(normalized);
  if (name) {
    return { name, address };
  }
  if (address) {
    return { name: address, address: '' };
  }
  return { name: MESSAGES.NOT_AVAILABLE_SHORT, address: '' };
};

const ReservationListItem = ({ reservation, onEdit, onDelete }) => {
  const reservationId = reservation?.reservationId ?? reservation?.id;
  const reservationLabel = reservationId ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const vehicleLabel = resolveVehicleLabel(reservation);
  const statusLabel = resolveStatusLabel(reservation);
  const pickupDetails = resolveHeadquartersDetails(reservation?.pickupHeadquarters);
  const returnDetails = resolveHeadquartersDetails(reservation?.returnHeadquarters);

  return (
    <article className="vehicle-list-item reservation-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{MESSAGES.RESERVATION_REFERENCE} #{reservationLabel}</h3>
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
          <span className="detail-value">{pickupDetails.name}</span>
          {pickupDetails.address && (
            <span className="detail-subvalue">{pickupDetails.address}</span>
          )}
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.RETURN_LOCATION}</span>
          <span className="detail-value">{returnDetails.name}</span>
          {returnDetails.address && (
            <span className="detail-subvalue">{returnDetails.address}</span>
          )}
        </div>
      </div>
      {(typeof onEdit === 'function' || typeof onDelete === 'function') && (
        <div className="item-actions">
          <div className="item-actions-group">
            {typeof onEdit === 'function' && reservationId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(reservationId)}>
                {MESSAGES.EDIT}
              </Button>
            )}
          </div>
          {typeof onDelete === 'function' && reservationId && (
            <Button
              className="item-actions-delete"
              variant={BUTTON_VARIANTS.DANGER}
              size="small"
              onClick={() => onDelete(reservationId)}
            >
              {MESSAGES.DELETE}
            </Button>
          )}
        </div>
      )}
    </article>
  );
};

export default ReservationListItem;
