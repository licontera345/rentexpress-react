import { MESSAGES } from '../constants';

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

export const normalizeSelectValue = (value) => {
  if (value === null || value === undefined) return '';
  if (value === 0) return '0';
  return String(value);
};

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

export const toReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return dateValue;
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue;
  }
  const normalizedTime = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  return `${dateValue}T${normalizedTime}:00`;
};

export const mapReservationToFormData = (reservation = {}) => ({
  vehicleId: normalizeSelectValue(reservation.vehicleId ?? reservation.vehicle?.vehicleId),
  userId: normalizeSelectValue(reservation.userId ?? reservation.user?.userId ?? reservation.user?.id),
  pickupHeadquartersId: normalizeSelectValue(
    reservation.pickupHeadquartersId ?? reservation.pickupHeadquarters?.headquartersId
  ),
  returnHeadquartersId: normalizeSelectValue(
    reservation.returnHeadquartersId ?? reservation.returnHeadquarters?.headquartersId
  ),
  startDate: normalizeDateInput(reservation.startDate ?? reservation.pickupDate ?? ''),
  startTime: normalizeTimeInput(reservation.startDate ?? reservation.pickupDate ?? ''),
  endDate: normalizeDateInput(reservation.endDate ?? reservation.returnDate ?? ''),
  endTime: normalizeTimeInput(reservation.endDate ?? reservation.returnDate ?? ''),
  reservationStatusId: normalizeSelectValue(
    reservation.reservationStatusId ?? reservation.reservationStatus?.reservationStatusId
  )
});

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
