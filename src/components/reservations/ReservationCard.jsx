import Button from '../common/Button';
import { MESSAGES, BUTTON_VARIANTS, RESERVATION_STATUS } from '../../constants';
import './ReservationCard.css';

function ReservationCard({ reservation, onCancel, onViewDetails }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      [RESERVATION_STATUS.ACTIVE]: 'status-active',
      [RESERVATION_STATUS.COMPLETED]: 'status-completed',
      [RESERVATION_STATUS.CANCELLED]: 'status-cancelled'
    };
    return statusMap[status] || 'status-active';
  };

  return (
    <div className="reservation-card">
      <div className="card-header">
        <div className="vehicle-info">
          <h4>{reservation.vehicleBrand} {reservation.vehicleModel}</h4>
          <span className={`status-badge ${getStatusBadgeClass(reservation.status)}`}>
            {reservation.status === RESERVATION_STATUS.ACTIVE && MESSAGES.RESERVATION_STATUS_ACTIVE}
            {reservation.status === RESERVATION_STATUS.COMPLETED && MESSAGES.RESERVATION_STATUS_COMPLETED}
            {reservation.status === RESERVATION_STATUS.CANCELLED && MESSAGES.RESERVATION_STATUS_CANCELLED}
          </span>
        </div>
        <div className="card-price">
          {formatPrice(reservation.totalPrice)}
        </div>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="label">📅 Fechas:</span>
          <span className="value">
            {formatDate(reservation.pickupDate)} - {formatDate(reservation.returnDate)}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">📍 Ubicación:</span>
          <span className="value">{reservation.pickupLocation}</span>
        </div>
        <div className="detail-row">
          <span className="label">⏱️ Duración:</span>
          <span className="value">{reservation.totalDays} días</span>
        </div>
      </div>

      <div className="card-actions">
        {typeof onViewDetails === 'function' && (
          <Button
            size="small"
            variant={BUTTON_VARIANTS.SECONDARY}
            onClick={() => onViewDetails(reservation.id)}
          >
            {MESSAGES.VIEW}
          </Button>
        )}
        {reservation.status === RESERVATION_STATUS.ACTIVE && typeof onCancel === 'function' && (
          <Button
            size="small"
            variant={BUTTON_VARIANTS.DANGER}
            onClick={() => onCancel(reservation.id)}
          >
            {MESSAGES.CANCEL}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;
