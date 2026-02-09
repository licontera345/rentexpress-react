import { MESSAGES } from '../constants';

// Normaliza distintas entradas a un formato yyyy-mm-dd.
export const normalizeDateInput = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';
    if (trimmedValue.includes('T')) {
      return trimmedValue.split('T')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      return trimmedValue;
    }
    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  return '';
};

// Normaliza el valor de select para que siempre sea string.
export const normalizeSelectValue = (value) => {
  if (value === null || value === undefined) return '';
  if (value === 0) return '0';
  return String(value);
};

// Normaliza distintas entradas a un formato hh:mm.
export const normalizeTimeInput = (value) => {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(11, 16);
  }
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';
    if (trimmedValue.includes('T')) {
      const timePart = trimmedValue.split('T')[1];
      if (timePart) return timePart.slice(0, 5);
    }
    if (/^\d{2}:\d{2}/.test(trimmedValue)) {
      return trimmedValue.slice(0, 5);
    }
    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(11, 16);
    }
  }
  return '';
};

// Une fecha y hora en un string ISO sin timezone.
export const toReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return dateValue;
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue;
  }
  const normalizedTime = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  return `${dateValue}T${normalizedTime}:00`;
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

// Construye el payload de API a partir del formulario.
export const buildReservationPayload = (formData, { employeeId } = {}) => {
  const payload = {
    vehicleId: Number(formData.vehicleId),
    pickupHeadquartersId: Number(formData.pickupHeadquartersId),
    returnHeadquartersId: Number(formData.returnHeadquartersId),
    startDate: toReservationDateTime(formData.startDate, formData.startTime),
    endDate: toReservationDateTime(formData.endDate, formData.endTime)
  };

  if (formData.userId !== undefined && formData.userId !== '') {
    payload.userId = Number(formData.userId);
  }

  if (formData.reservationStatusId !== undefined && formData.reservationStatusId !== '') {
    payload.reservationStatusId = Number(formData.reservationStatusId);
  }

  if (employeeId !== undefined && employeeId !== null && employeeId !== '') {
    payload.employeeId = Number(employeeId);
  }

  return payload;
};

// Valida el formulario de reservas y devuelve un mapa de errores.
export const validateReservationForm = (
  formData,
  {
    requireVehicleId = true,
    requireUserId = false,
    requireStatus = false
  } = {}
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

  const startDateValue = formData.startDate
    ? new Date(toReservationDateTime(formData.startDate, formData.startTime))
    : null;
  const endDateValue = formData.endDate
    ? new Date(toReservationDateTime(formData.endDate, formData.endTime))
    : null;

  if (startDateValue && endDateValue && endDateValue < startDateValue) {
    errors.endDate = MESSAGES.RESERVATION_DATE_RANGE_INVALID;
  }

  return errors;
};
