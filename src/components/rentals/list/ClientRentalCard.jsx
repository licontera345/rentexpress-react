import { FiCalendar, FiMapPin, FiDollarSign, FiCheck, FiXCircle } from 'react-icons/fi';
import { MESSAGES } from '../../../constants';
import { formatDate, formatCurrency } from '../../../utils/form/formatters';
import { resolveReservationHeadquartersDetails } from '../../../utils/reservation/reservationUtils';

const getRentalStatusLabel = (rental, statusById) => {
  const status = statusById?.get?.(Number(rental?.rentalStatusId));
  return status?.statusName || rental?.rentalStatus?.statusName || MESSAGES.NOT_AVAILABLE_SHORT;
};

const getCardStatusClass = (statusLabel) => {
  if (!statusLabel || typeof statusLabel !== 'string') return 'status-unknown';
  const lower = statusLabel.trim().toLowerCase();
  if (lower.includes('progress') || lower.includes('curso') || lower.includes('en cours') || lower.includes('activo') || lower.includes('active')) return 'status-active';
  if (lower.includes('complet') || lower.includes('finish') || lower.includes('termin')) return 'status-completed';
  if (lower.includes('cancel') || lower.includes('annul')) return 'status-cancelled';
  return 'status-unknown';
};

const getBadgeClass = (statusLabel) => {
  const card = getCardStatusClass(statusLabel);
  return card.replace('status-', '');
};

const formatDatePart = (value, { fallback = null } = {}) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
};

const formatTimePart = (value, { fallback = null } = {}) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const StatusIcon = ({ statusClass }) => {
  if (statusClass === 'completed') return <FiCheck strokeWidth={2} aria-hidden />;
  if (statusClass === 'cancelled') return <FiXCircle strokeWidth={2} aria-hidden />;
  return null;
};

function ClientRentalCard({ rental, headquartersById, statusById }) {
  const rentalId = rental?.rentalId ?? rental?.id;
  const statusLabel = getRentalStatusLabel(rental, statusById);
  const cardStatusClass = getCardStatusClass(statusLabel);
  const badgeClass = getBadgeClass(statusLabel);

  const pickupHeadquarters =
    rental?.pickupHeadquarters ?? headquartersById?.get?.(Number(rental?.pickupHeadquartersId)) ?? null;
  const returnHeadquarters =
    rental?.returnHeadquarters ?? headquartersById?.get?.(Number(rental?.returnHeadquartersId)) ?? null;

  const pickupDetails = resolveReservationHeadquartersDetails(pickupHeadquarters);
  const returnDetails = resolveReservationHeadquartersDetails(returnHeadquarters);

  const startDate = rental?.startDateEffective ?? rental?.startDate;
  const endDate = rental?.endDateEffective ?? rental?.endDate;
  const pickupDateStr = formatDatePart(startDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT });
  const pickupTimeStr = formatTimePart(startDate, { fallback: '' });
  const returnDateStr = formatDatePart(endDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT });
  const returnTimeStr = formatTimePart(endDate, { fallback: '' });

  const totalCost = rental?.totalCost != null ? formatCurrency(rental.totalCost) : MESSAGES.NOT_AVAILABLE_SHORT;
  const isCancelled = cardStatusClass === 'status-cancelled';
  const paymentLabel = isCancelled ? MESSAGES.RENTAL_REFUNDED : MESSAGES.RENTAL_PAID_TOTAL;

  return (
    <article className={`client-rental-card ${cardStatusClass}`}>
      <div className="client-rental-card__header">
        <div className="client-rental-card__title">
          <h3>{MESSAGES.RENTAL_REFERENCE} #{rentalId ?? MESSAGES.NOT_AVAILABLE_SHORT}</h3>
          <span className="client-rental-card__price-badge">
            <FiDollarSign aria-hidden />
            {totalCost}
          </span>
        </div>
        <span className={`client-rental-card__status-badge ${badgeClass}`}>
          <StatusIcon statusClass={badgeClass} />
          {statusLabel}
        </span>
      </div>

      <div className="client-rental-card__details">
        <div className="client-rental-card__detail-group">
          <div className="client-rental-card__detail-item">
            <span className="client-rental-card__detail-label">
              <FiCalendar aria-hidden />
              {MESSAGES.PICKUP_DATE}
            </span>
            <div>
              <div className="client-rental-card__detail-value">{pickupDateStr}</div>
              {pickupTimeStr && <div className="client-rental-card__detail-subvalue">{pickupTimeStr}</div>}
            </div>
          </div>
          <div className="client-rental-card__detail-item">
            <span className="client-rental-card__detail-label">
              <FiCalendar aria-hidden />
              {MESSAGES.RETURN_DATE}
            </span>
            <div>
              <div className="client-rental-card__detail-value">{returnDateStr}</div>
              {returnTimeStr && <div className="client-rental-card__detail-subvalue">{returnTimeStr}</div>}
            </div>
          </div>
        </div>
        <div className="client-rental-card__detail-group">
          <div className="client-rental-card__detail-item">
            <span className="client-rental-card__detail-label">
              <FiMapPin aria-hidden />
              {MESSAGES.PICKUP_LOCATION}
            </span>
            <div>
              <div className="client-rental-card__detail-value">{pickupDetails.name}</div>
              {pickupDetails.address && <div className="client-rental-card__detail-subvalue">{pickupDetails.address}</div>}
            </div>
          </div>
          <div className="client-rental-card__detail-item">
            <span className="client-rental-card__detail-label">
              <FiMapPin aria-hidden />
              {MESSAGES.RETURN_LOCATION}
            </span>
            <div>
              <div className="client-rental-card__detail-value">{returnDetails.name}</div>
              {returnDetails.address && <div className="client-rental-card__detail-subvalue">{returnDetails.address}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="client-rental-card__payment-summary">
        <span className="client-rental-card__payment-label">{paymentLabel}</span>
        <span className="client-rental-card__payment-amount">{totalCost}</span>
      </div>
    </article>
  );
}

export default ClientRentalCard;
