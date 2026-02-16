import { MESSAGES } from '../constants';
import { toFormControlValue } from './formatters';
import { normalizeDateInput, normalizeTimeInput } from './formInputUtils';

export { normalizeDateInput, normalizeTimeInput };

export const normalizeSelectValue = toFormControlValue;

/** Junta fecha y hora en un string ISO (sin timezone). Si ya viene con hora, lo devuelve tal cual. */
export const toReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return dateValue;
  if (typeof dateValue === 'string' && dateValue.includes('T')) return dateValue;

  const hora = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  return `${dateValue}T${hora}:00`;
};

// Extrae valores iniciales del formulario de creación desde el estado de navegación.
export const getReservationCreateInitialValues = (locationState = {}) => ({
  vehicleId: normalizeSelectValue(locationState.vehicleId || locationState.vehicle?.vehicleId || ''),
  pickupHeadquartersId: normalizeSelectValue(locationState.pickupHeadquartersId || locationState.currentHeadquartersId || ''),
  returnHeadquartersId: normalizeSelectValue(locationState.returnHeadquartersId || ''),
  startDate: normalizeDateInput(locationState.startDate || ''),
  startTime: normalizeTimeInput(locationState.startTime || locationState.startDate || ''),
  endDate: normalizeDateInput(locationState.endDate || ''),
  endTime: normalizeTimeInput(locationState.endTime || locationState.endDate || ''),
  dailyPrice: locationState.dailyPrice || locationState.vehicle?.dailyPrice || ''
});

// Extrae el resumen del vehículo desde el estado de navegación.
export const getReservationVehicleSummaryFromLocation = (locationState = {}) => {
  const summary = locationState.vehicleSummary || locationState.vehicle || {};
  return {
    brand: summary.brand || '',
    model: summary.model || '',
    licensePlate: summary.licensePlate || '',
    manufactureYear: summary.manufactureYear || '',
    currentMileage: summary.currentMileage || ''
  };
};

// Transforma una reserva en datos listos para el formulario.
export const mapReservationToFormData = (reservation = {}) => ({
  vehicleId: normalizeSelectValue(reservation.vehicleId ?? reservation.vehicle?.vehicleId),
  userId: normalizeSelectValue(reservation.userId ?? reservation.user?.userId),
  pickupHeadquartersId: normalizeSelectValue(
    reservation.pickupHeadquartersId ?? reservation.pickupHeadquarters?.id
  ),
  returnHeadquartersId: normalizeSelectValue(
    reservation.returnHeadquartersId ?? reservation.returnHeadquarters?.id
  ),
  startDate: normalizeDateInput(reservation.startDate ?? ''),
  startTime: normalizeTimeInput(reservation.startDate ?? ''),
  endDate: normalizeDateInput(reservation.endDate ?? ''),
  endTime: normalizeTimeInput(reservation.endDate ?? ''),
  reservationStatusId: normalizeSelectValue(
    reservation.reservationStatusId ?? reservation.reservationStatus?.reservationStatusId
  )
});

/** Convierte los datos del formulario al formato que espera la API. */
export const buildReservationPayload = (formData, { employeeId } = {}) => {
  const payload = {
    vehicleId: Number(formData.vehicleId),
    pickupHeadquartersId: Number(formData.pickupHeadquartersId),
    returnHeadquartersId: Number(formData.returnHeadquartersId),
    startDate: toReservationDateTime(formData.startDate, formData.startTime),
    endDate: toReservationDateTime(formData.endDate, formData.endTime)
  };

  const tieneValor = (v) => v !== undefined && v !== null && v !== '';
  if (tieneValor(formData.userId)) payload.userId = Number(formData.userId);
  if (tieneValor(formData.reservationStatusId)) payload.reservationStatusId = Number(formData.reservationStatusId);
  if (tieneValor(employeeId)) payload.employeeId = Number(employeeId);

  return payload;
};

/** Valida el formulario y devuelve un objeto con los errores por campo. */
export const validateReservationForm = (
  formData,
  { requireVehicleId = true, requireUserId = false, requireStatus = false } = {}
) => {
  const errors = {};

  if (requireVehicleId && !formData.vehicleId) errors.vehicleId = MESSAGES.FIELD_REQUIRED;
  if (requireUserId && !formData.userId) errors.userId = MESSAGES.FIELD_REQUIRED;
  if (!formData.pickupHeadquartersId) errors.pickupHeadquartersId = MESSAGES.FIELD_REQUIRED;
  if (!formData.returnHeadquartersId) errors.returnHeadquartersId = MESSAGES.FIELD_REQUIRED;
  if (!formData.startDate) errors.startDate = MESSAGES.FIELD_REQUIRED;
  if (!formData.startTime) errors.startTime = MESSAGES.FIELD_REQUIRED;
  if (!formData.endDate) errors.endDate = MESSAGES.FIELD_REQUIRED;
  if (!formData.endTime) errors.endTime = MESSAGES.FIELD_REQUIRED;
  if (requireStatus && !formData.reservationStatusId) errors.reservationStatusId = MESSAGES.FIELD_REQUIRED;

  const inicio = formData.startDate
    ? new Date(toReservationDateTime(formData.startDate, formData.startTime))
    : null;
  const fin = formData.endDate
    ? new Date(toReservationDateTime(formData.endDate, formData.endTime))
    : null;
  if (inicio && fin && fin < inicio) {
    errors.endDate = MESSAGES.RESERVATION_DATE_RANGE_INVALID;
  }

  return errors;
};

// --- Estado inicial para flujos de reserva (catálogo → crear reserva, lista vehículos → reservar) ---

const buildVehicleSummary = (vehicle = {}) => ({
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  licensePlate: vehicle.licensePlate ?? '',
  manufactureYear: vehicle.manufactureYear ?? '',
  currentMileage: vehicle.currentMileage ?? ''
});

const buildBaseReservationState = (vehicle = {}) => ({
  vehicleId: vehicle.vehicleId ?? '',
  dailyPrice: vehicle.dailyPrice ?? '',
  vehicleSummary: buildVehicleSummary(vehicle),
  currentHeadquartersId: vehicle.currentHeadquartersId ?? ''
});

/** Construye el estado inicial del formulario de reserva a partir de vehículo y/o criterios de búsqueda. */
export const buildReservationState = ({ vehicle = {}, criteria } = {}) => {
  const baseState = buildBaseReservationState(vehicle);
  if (!criteria) return baseState;
  return {
    ...baseState,
    pickupHeadquartersId: criteria.currentHeadquartersId ?? criteria.pickupHeadquartersId ?? '',
    returnHeadquartersId: criteria.returnHeadquartersId ?? '',
    startDate: criteria.pickupDate ?? criteria.startDate ?? '',
    startTime: criteria.pickupTime ?? criteria.startTime ?? '',
    endDate: criteria.returnDate ?? criteria.endDate ?? '',
    endTime: criteria.returnTime ?? criteria.endTime ?? '',
    pickupDate: criteria.pickupDate ?? '',
    pickupTime: criteria.pickupTime ?? '',
    returnDate: criteria.returnDate ?? '',
    returnTime: criteria.returnTime ?? ''
  };
};
