import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { formatDate } from '../../../utils/formatters';
import {
  resolveReservationVehicleLabel,
  resolveReservationStatusLabel,
  resolveReservationStatusClass,
  resolveReservationHeadquartersDetails
} from '../../../utils/reservationUtils';

// Tarjeta de una reserva con fechas, sedes y acciones principales.
const ReservationListItem = ({ reservation, onEdit, onDelete, headquartersById, statusById }) => {
  const reservationId = reservation?.reservationId;
  const reservationLabel = reservationId ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const vehicleLabel = resolveReservationVehicleLabel(reservation);
  const statusLabel = resolveReservationStatusLabel(
    reservation,
    statusById?.get?.(Number(reservation?.reservationStatusId))
  );
  const statusClass = resolveReservationStatusClass(statusLabel);

  const pickupHeadquarters =
    reservation?.pickupHeadquarters?.[0]
    ?? headquartersById?.get?.(Number(reservation?.pickupHeadquartersId))
    ?? null;
  const returnHeadquarters =
    reservation?.returnHeadquarters?.[0]
    ?? headquartersById?.get?.(Number(reservation?.returnHeadquartersId))
    ?? null;

  const pickupDetails = resolveReservationHeadquartersDetails(pickupHeadquarters);
  const returnDetails = resolveReservationHeadquartersDetails(returnHeadquarters);

  return (
    <article className="vehicle-list-item reservation-list-item">
      <div className="item-header">
        <div className="item-info">
          <h3 className="item-title">{MESSAGES.RESERVATION_REFERENCE} #{reservationLabel}</h3>
          <p className="item-plate">{vehicleLabel}</p>
        </div>
        <span className={`item-status ${statusClass}`}>{statusLabel}</span>
      </div>
      <div className="item-details">
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.PICKUP_DATE}</span>
          <span className="detail-value">{formatDate(reservation?.startDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT })}</span>
        </div>
        <div className="detail-col">
          <span className="detail-label">{MESSAGES.RETURN_DATE}</span>
          <span className="detail-value">{formatDate(reservation?.endDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT })}</span>
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
