import { FiCalendar, FiMapPin, FiTruck } from 'react-icons/fi';
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

  const pickupDate = formatDate(reservation?.startDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT });
  const returnDate = formatDate(reservation?.endDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT });

  return (
    <article className={`vehicle-list-item reservation-list-item reservation-list-item--${statusClass}`}>
      <div className="reservation-list-item__header">
        <div className="reservation-list-item__info">
          <h3 className="reservation-list-item__title">
            {MESSAGES.RESERVATION_REFERENCE} #{reservationLabel}
          </h3>
          <p className="reservation-list-item__vehicle">
            <FiTruck className="reservation-list-item__icon" aria-hidden />
            {vehicleLabel}
          </p>
        </div>
        <span className={`reservation-list-item__status ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="reservation-list-item__details">
        <div className="reservation-list-item__dates">
          <div className="reservation-list-item__detail">
            <span className="reservation-list-item__label">
              <FiCalendar aria-hidden />
              {MESSAGES.PICKUP_DATE}
            </span>
            <span className="reservation-list-item__value">{pickupDate}</span>
          </div>
          <div className="reservation-list-item__detail">
            <span className="reservation-list-item__label">
              <FiCalendar aria-hidden />
              {MESSAGES.RETURN_DATE}
            </span>
            <span className="reservation-list-item__value">{returnDate}</span>
          </div>
        </div>

        <div className="reservation-list-item__locations">
          <div className="reservation-list-item__detail reservation-list-item__detail--location">
            <span className="reservation-list-item__label">
              <FiMapPin aria-hidden />
              {MESSAGES.PICKUP_LOCATION}
            </span>
            <span className="reservation-list-item__value">{pickupDetails.name}</span>
            {pickupDetails.address && (
              <span className="reservation-list-item__subvalue">{pickupDetails.address}</span>
            )}
          </div>
          <div className="reservation-list-item__detail reservation-list-item__detail--location">
            <span className="reservation-list-item__label">
              <FiMapPin aria-hidden />
              {MESSAGES.RETURN_LOCATION}
            </span>
            <span className="reservation-list-item__value">{returnDetails.name}</span>
            {returnDetails.address && (
              <span className="reservation-list-item__subvalue">{returnDetails.address}</span>
            )}
          </div>
        </div>
      </div>

      {(typeof onEdit === 'function' || typeof onDelete === 'function') && (
        <div className="reservation-list-item__actions">
          <div className="reservation-list-item__actions-group">
            {typeof onEdit === 'function' && reservationId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(reservationId)}>
                {MESSAGES.EDIT}
              </Button>
            )}
          </div>
          {typeof onDelete === 'function' && reservationId && (
            <Button
              className="reservation-list-item__actions-delete"
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
