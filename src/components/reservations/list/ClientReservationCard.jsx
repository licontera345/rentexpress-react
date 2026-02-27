import { FiCalendar, FiMapPin, FiTruck, FiKey, FiCheck, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { MESSAGES } from '../../../constants';
import { formatDate } from '../../../utils/form/formatters';
import {
  resolveReservationVehicleLabel,
  resolveReservationStatusLabel,
  resolveReservationStatusClass,
  resolveReservationHeadquartersDetails,
  getReservationStatusCanonical
} from '../../../utils/reservation/reservationUtils';

// Clase CSS para la tarjeta según estado (cancelada usa status-cancelled en esta vista)
const getCardStatusClass = (reservation, statusById) => {
  const status = statusById?.get?.(Number(reservation?.reservationStatusId));
  const raw = status?.statusName || '';
  const canonical = getReservationStatusCanonical(raw);
  if (canonical === 'canceled') return 'status-cancelled';
  return resolveReservationStatusClass(
    resolveReservationStatusLabel(reservation, status)
  );
};

// Clase del badge (available, maintenance, rented, cancelled)
const getBadgeClass = (reservation, statusById) => {
  const status = statusById?.get?.(Number(reservation?.reservationStatusId));
  const raw = status?.statusName || '';
  const canonical = getReservationStatusCanonical(raw);
  if (canonical === 'canceled') return 'cancelled';
  const c = resolveReservationStatusClass(resolveReservationStatusLabel(reservation, status));
  return c.replace('status-', '');
};

const formatDateWithTime = (value, { fallback = null } = {}) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  const d = date.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
  const t = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${d} · ${t}`;
};

const StatusIcon = ({ statusClass }) => {
  if (statusClass === 'available' || statusClass === 'cancelled') {
    return statusClass === 'available' ? (
      <FiCheck strokeWidth={2} aria-hidden />
    ) : (
      <FiXCircle strokeWidth={2} aria-hidden />
    );
  }
  if (statusClass === 'maintenance') return <FiAlertCircle strokeWidth={2} aria-hidden />;
  if (statusClass === 'rented') return <FiXCircle strokeWidth={2} aria-hidden />;
  return null;
};

function ClientReservationCard({
  reservation,
  headquartersById,
  statusById,
  onEdit,
  onDelete,
  showPickupCode = true
}) {
  const reservationId = reservation?.reservationId ?? reservation?.id;
  const reservationLabel = reservationId ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const vehicleLabel = resolveReservationVehicleLabel(reservation);
  const statusLabel = resolveReservationStatusLabel(
    reservation,
    statusById?.get?.(Number(reservation?.reservationStatusId))
  );
  const cardStatusClass = getCardStatusClass(reservation, statusById);
  const badgeClass = getBadgeClass(reservation, statusById);

  const pickupHeadquarters =
    headquartersById?.get?.(Number(reservation?.pickupHeadquartersId)) ?? reservation?.pickupHeadquarters?.[0] ?? null;
  const returnHeadquarters =
    headquartersById?.get?.(Number(reservation?.returnHeadquartersId)) ?? reservation?.returnHeadquarters?.[0] ?? null;

  const pickupDetails = resolveReservationHeadquartersDetails(pickupHeadquarters);
  const returnDetails = resolveReservationHeadquartersDetails(returnHeadquarters);

  const pickupDateFormatted = formatDateWithTime(reservation?.startDate, { fallback: formatDate(reservation?.startDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT }) });
  const returnDateFormatted = formatDateWithTime(reservation?.endDate, { fallback: formatDate(reservation?.endDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT }) });

  const pickupLocationDisplay = pickupDetails.name || MESSAGES.NOT_AVAILABLE_SHORT;
  const pickupAddressDisplay = pickupDetails.address || null;
  const returnLocationDisplay = returnDetails.name || MESSAGES.NOT_AVAILABLE_SHORT;
  const returnAddressDisplay = returnDetails.address || null;

  const showActions = typeof onEdit === 'function' || typeof onDelete === 'function';
  const isPending = typeof onEdit === 'function';

  return (
    <article className={`client-reservation-card ${cardStatusClass}`}>
      <div className="client-reservation-card__header">
        <div className="client-reservation-card__title">
          <h3>{MESSAGES.RESERVATION_REFERENCE} #{reservationLabel}</h3>
          <span className="client-reservation-card__vehicle-badge">
            <FiTruck aria-hidden />
            {vehicleLabel}
          </span>
        </div>
        <span className={`client-reservation-card__status-badge ${badgeClass}`}>
          <StatusIcon statusClass={badgeClass} />
          {statusLabel}
        </span>
      </div>

      <div className="client-reservation-card__details">
        <div className="client-reservation-card__detail-group">
          <div className="client-reservation-card__detail-item">
            <span className="client-reservation-card__detail-label">
              <FiCalendar aria-hidden />
              {MESSAGES.PICKUP_DATE}
            </span>
            <span className="client-reservation-card__detail-value">{pickupDateFormatted}</span>
          </div>
          <div className="client-reservation-card__detail-item">
            <span className="client-reservation-card__detail-label">
              <FiCalendar aria-hidden />
              {MESSAGES.RETURN_DATE}
            </span>
            <span className="client-reservation-card__detail-value">{returnDateFormatted}</span>
          </div>
        </div>
        <div className="client-reservation-card__detail-group">
          <div className="client-reservation-card__detail-item">
            <span className="client-reservation-card__detail-label">
              <FiMapPin aria-hidden />
              {MESSAGES.PICKUP_LOCATION}
            </span>
            <span className="client-reservation-card__detail-value">
              {pickupLocationDisplay}
              {pickupAddressDisplay && (
                <span className="client-reservation-card__detail-subvalue"> · {pickupAddressDisplay}</span>
              )}
            </span>
          </div>
          <div className="client-reservation-card__detail-item">
            <span className="client-reservation-card__detail-label">
              <FiMapPin aria-hidden />
              {MESSAGES.RETURN_LOCATION}
            </span>
            <span className="client-reservation-card__detail-value">
              {returnLocationDisplay}
              {returnAddressDisplay && (
                <span className="client-reservation-card__detail-subvalue"> · {returnAddressDisplay}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {showPickupCode && reservation?.pickupCode && (
        <div className="client-reservation-card__pickup-code">
          <FiKey aria-hidden />
          <span className="client-reservation-card__pickup-code-label">{MESSAGES.PICKUP_CODE_DISPLAY}:</span>
          <span className="client-reservation-card__pickup-code-value">{reservation.pickupCode}</span>
        </div>
      )}

      {showActions && isPending && (
        <div className="client-reservation-card__actions">
          {typeof onEdit === 'function' && reservationId && (
            <button type="button" className="client-reservation-card__btn-secondary" onClick={() => onEdit(reservationId)}>
              {MESSAGES.EDIT}
            </button>
          )}
          {typeof onDelete === 'function' && reservationId && (
            <button type="button" className="client-reservation-card__btn-danger" onClick={() => onDelete(reservationId)}>
              {MESSAGES.CANCEL_RESERVATION}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default ClientReservationCard;
