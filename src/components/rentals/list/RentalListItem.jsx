import { FiCalendar, FiMapPin, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { formatDate } from '../../../utils/form/formatters';
import { resolveReservationHeadquartersDetails } from '../../../utils/reservation/reservationUtils';

const getRentalStatusLabel = (rental, statusById) => {
  const status = statusById?.get?.(Number(rental?.rentalStatusId));
  return status?.statusName || rental?.rentalStatus?.statusName || MESSAGES.NOT_AVAILABLE_SHORT;
};

const getRentalStatusClass = (statusLabel) => {
  if (!statusLabel || typeof statusLabel !== 'string') return 'status-unknown';
  const lower = statusLabel.trim().toLowerCase();
  if (lower.includes('progress') || lower.includes('curso') || lower.includes('en cours')) return 'status-maintenance';
  if (lower.includes('complet') || lower.includes('finish') || lower.includes('termin')) return 'status-available';
  if (lower.includes('cancel') || lower.includes('annul')) return 'status-rented';
  return 'status-unknown';
};

export default function RentalListItem({ rental, onEdit, onDelete, onCompleteReturn, headquartersById, statusById }) {
  const rentalId = rental?.rentalId;
  const pickupHeadquarters =
    rental?.pickupHeadquarters
    ?? headquartersById?.get?.(Number(rental?.pickupHeadquartersId))
    ?? null;
  const returnHeadquarters =
    rental?.returnHeadquarters
    ?? headquartersById?.get?.(Number(rental?.returnHeadquartersId))
    ?? null;
  const pickupDetails = resolveReservationHeadquartersDetails(pickupHeadquarters);
  const returnDetails = resolveReservationHeadquartersDetails(returnHeadquarters);
  const startDate = formatDate(rental?.startDateEffective, { fallback: MESSAGES.NOT_AVAILABLE_SHORT });
  const endDate = formatDate(rental?.endDateEffective, { fallback: MESSAGES.NOT_AVAILABLE_SHORT });
  const totalCost = rental?.totalCost != null ? `${Number(rental.totalCost).toFixed(2)} €` : MESSAGES.NOT_AVAILABLE_SHORT;
  const statusLabel = getRentalStatusLabel(rental, statusById);
  const statusClass = getRentalStatusClass(statusLabel);

  return (
    <article className={`vehicle-list-item reservation-list-item rental-list-item reservation-list-item--${statusClass}`}>
      <div className="reservation-list-item__header">
        <div className="reservation-list-item__info">
          <h3 className="reservation-list-item__title">
            {MESSAGES.RENTAL_REFERENCE} #{rentalId || MESSAGES.NOT_AVAILABLE_SHORT}
          </h3>
          <p className="reservation-list-item__vehicle">
            <FiDollarSign className="reservation-list-item__icon" aria-hidden />
            {totalCost}
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
            <span className="reservation-list-item__value">{startDate}</span>
          </div>
          <div className="reservation-list-item__detail">
            <span className="reservation-list-item__label">
              <FiCalendar aria-hidden />
              {MESSAGES.RETURN_DATE}
            </span>
            <span className="reservation-list-item__value">{endDate}</span>
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

      {(typeof onEdit === 'function' || typeof onDelete === 'function' || typeof onCompleteReturn === 'function') && (
        <div className="reservation-list-item__actions">
          <div className="reservation-list-item__actions-group">
            {typeof onCompleteReturn === 'function' && rentalId && rental?.allowedActions?.includes('completeReturn') && (
              <Button variant={BUTTON_VARIANTS.SUCCESS} size="small" onClick={() => onCompleteReturn(rentalId)}>
                <FiCheckCircle aria-hidden />
                {MESSAGES.COMPLETE_RETURN}
              </Button>
            )}
            {typeof onEdit === 'function' && rentalId && (
              <Button variant={BUTTON_VARIANTS.SECONDARY} size="small" onClick={() => onEdit(rentalId)}>
                {MESSAGES.EDIT}
              </Button>
            )}
          </div>
          {typeof onDelete === 'function' && rentalId && (
            <Button
              className="reservation-list-item__actions-delete"
              variant={BUTTON_VARIANTS.DANGER}
              size="small"
              onClick={() => onDelete(rentalId)}
            >
              {MESSAGES.DELETE}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
