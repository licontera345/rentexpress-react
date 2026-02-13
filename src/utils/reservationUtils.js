import { MESSAGES } from '../constants';
import { getHeadquartersAddressLabel, getHeadquartersNameLabel } from '../constants/headquartersLabels';

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

// Construye la etiqueta del vehículo usando marca, modelo y placa disponibles.
export const resolveReservationVehicleLabel = (reservation) => {
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
export const resolveReservationStatusLabel = (reservation) => (
  reservation?.reservationStatus?.statusName
  || reservation?.reservationStatus?.[0]?.statusName
  || MESSAGES.NOT_AVAILABLE_SHORT
);

// Determina la clase CSS del estado de la reserva.
export const resolveReservationStatusClass = (statusLabel) => {
  const normalizedStatus = statusLabel?.trim()?.toLowerCase() ?? '';
  return RESERVATION_STATUS_CLASS[normalizedStatus] || 'status-unknown';
};

// Resuelve datos de sede para mostrar nombre y dirección si existen.
export const resolveReservationHeadquartersDetails = (headquarters) => {
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
