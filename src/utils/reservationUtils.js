import { MESSAGES } from '../constants';
import { getHeadquartersAddressLabel, getHeadquartersNameLabel } from '../constants/headquartersLabels';
import { getReservationStatusMessageKey, getReservationStatusCanonical } from './reservationStatusUtils';

const RESERVATION_STATUS_CLASS_BY_CANONICAL = {
  pending: 'status-maintenance',
  confirmed: 'status-available',
  canceled: 'status-rented',
  completed: 'status-available',
  active: 'status-available'
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
export const resolveReservationStatusLabel = (reservation, statusFromLookup) => (
  (() => {
    const raw =
      // Preferimos el catálogo `statusFromLookup` porque viene filtrado por `isoCode`
      // (y por tanto debería estar traducido desde BD). El objeto embebido en la
      // reserva a veces llega sin localizar.
      statusFromLookup?.statusName
      || reservation?.reservationStatus?.statusName
      || reservation?.reservationStatus?.[0]?.statusName
      || '';

    const messageKey = getReservationStatusMessageKey(raw);
    if (messageKey) {
      return MESSAGES[messageKey];
    }

    return raw || MESSAGES.NOT_AVAILABLE_SHORT;
  })()
);

// Determina la clase CSS del estado de la reserva.
export const resolveReservationStatusClass = (statusLabel) => {
  const canonical = getReservationStatusCanonical(statusLabel);
  return RESERVATION_STATUS_CLASS_BY_CANONICAL[canonical] || 'status-unknown';
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
