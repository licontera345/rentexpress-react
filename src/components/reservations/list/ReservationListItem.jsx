import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { getHeadquartersAddressLabel, getHeadquartersNameLabel } from '../../../constants/headquartersLabels';

const RESERVATION_STATUS_CLASS = {
  pending: 'status-maintenance',
  pendiente: 'status-maintenance',
  canceled: 'status-rented',
  cancelled: 'status-rented',
  cancelada: 'status-rented',
  cancelado: 'status-rented',
  confirmed: 'status-available',
  confirmada: 'status-available',
  confirmado: 'status-available',
  completed: 'status-available',
  completada: 'status-available',
  completado: 'status-available',
  active: 'status-available',
  activa: 'status-available',
  activo: 'status-available'
};

// Formatea fechas en un formato legible y seguro para valores vacíos.

const formatDate = (value) => {
  if (!value) return MESSAGES.NOT_AVAILABLE_SHORT;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return MESSAGES.NOT_AVAILABLE_SHORT;
  }
  return date.toLocaleDateString();
};

// Construye la etiqueta del vehículo usando marca, modelo y placa disponibles.
const resolveVehicleLabel = (reservation) => {
  const vehicle = reservation?.vehicle?.[0];
  const brand = vehicle?.brand;
  const model = vehicle?.model;
  const plate = vehicle?.licensePlate;
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

// Determina el estado de la reserva desde distintas fuentes posibles.
const resolveStatusLabel = (reservation) => (
  reservation?.reservationStatus?.statusName
  || reservation?.reservationStatus?.[0]?.statusName
  || MESSAGES.NOT_AVAILABLE_SHORT
);

const resolveStatusClass = (statusLabel) => {
  const normalizedStatus = statusLabel?.trim()?.toLowerCase() ?? '';
  return RESERVATION_STATUS_CLASS[normalizedStatus] || 'status-unknown';
};

// Resuelve datos de sede para mostrar nombre y dirección si existen.
const resolveHeadquartersDetails = (headquarters) => {
  if (!headquarters) {
    return { name: MESSAGES.NOT_AVAILABLE_SHORT, address: '' };
  }
  const name = getHeadquartersNameLabel(headquarters);
  const address = getHeadquartersAddressLabel(headquarters);
  if (name) {
    return { name, address };
  }
  if (address) {
    return { name: address, address: '' };
  }
  return { name: MESSAGES.NOT_AVAILABLE_SHORT, address: '' };
};

// Tarjeta de una reserva con fechas, sedes y acciones principales.
const ReservationListItem = ({ reservation, onEdit, onDelete }) => {
  const reservationId = reservation?.reservationId;
  const reservationLabel = reservationId ?? MESSAGES.NOT_AVAILABLE_SHORT;
  const vehicleLabel = resolveVehicleLabel(reservation);
  const statusLabel = resolveStatusLabel(reservation);
  const statusClass = resolveStatusClass(statusLabel);
  const pickupDetails = resolveHeadquartersDetails(reservation?.pickupHeadquarters?.[0]);
  const returnDetails = resolveHeadquartersDetails(reservation?.returnHeadquarters?.[0]);

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
