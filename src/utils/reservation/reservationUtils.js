import { t } from '../../i18n';
import { MESSAGES, getHeadquartersAddressLabel, getHeadquartersNameLabel, getHeadquartersCityName } from '../../constants';
import { toFormControlValue, formatCurrency } from '../form/formatters';
import { normalizeDateInput, normalizeTimeInput } from '../form/formInputUtils';

// --- reservationStatusUtils: normalización y claves de mensaje ---
const stripDiacritics = (value) => {
  if (typeof value !== 'string') return '';
  try {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch {
    return value;
  }
};

export const normalizeReservationStatusToken = (value) => {
  if (typeof value !== 'string') return '';
  const normalized = stripDiacritics(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^\w]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized;
};

const CANONICAL_BY_TOKEN = {
  pending: 'pending', pendiente: 'pending', en_attente: 'pending', awaiting: 'pending', on_hold: 'pending',
  confirmed: 'confirmed', confirmada: 'confirmed', confirmado: 'confirmed', confirmee: 'confirmed', confirme: 'confirmed',
  canceled: 'canceled', cancelled: 'canceled', cancelada: 'canceled', cancelado: 'canceled', annulee: 'canceled', annule: 'canceled',
  completed: 'completed', completada: 'completed', completado: 'completed', terminee: 'completed', termine: 'completed',
  active: 'active', activa: 'active', activo: 'active',
};

export const getReservationStatusCanonical = (statusName) => {
  const token = normalizeReservationStatusToken(statusName);
  return CANONICAL_BY_TOKEN[token] || '';
};

const MESSAGE_KEY_BY_CANONICAL = {
  pending: 'RESERVATION_STATUS_PENDING',
  confirmed: 'RESERVATION_STATUS_CONFIRMED',
  canceled: 'RESERVATION_STATUS_CANCELED',
  completed: 'RESERVATION_STATUS_COMPLETED',
  active: 'RESERVATION_STATUS_ACTIVE',
};

export const getReservationStatusMessageKey = (statusName) => {
  const canonical = getReservationStatusCanonical(statusName);
  return canonical ? MESSAGE_KEY_BY_CANONICAL[canonical] : null;
};

// --- reservationFormUtils: formulario y payload ---
export { normalizeDateInput, normalizeTimeInput };
export const normalizeSelectValue = toFormControlValue;

export const toReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return dateValue;
  if (typeof dateValue === 'string' && dateValue.includes('T')) return dateValue;
  const hora = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  return `${dateValue}T${hora}:00`;
};

export const getReservationCreateInitialValues = (locationState) => {
  const state = locationState ?? {};
  return {
    vehicleId: normalizeSelectValue(state.vehicleId || state.vehicle?.vehicleId || ''),
    pickupHeadquartersId: normalizeSelectValue(state.pickupHeadquartersId || state.currentHeadquartersId || ''),
    returnHeadquartersId: normalizeSelectValue(state.returnHeadquartersId || ''),
    startDate: normalizeDateInput(state.startDate || ''),
    startTime: normalizeTimeInput(state.startTime || state.startDate || ''),
    endDate: normalizeDateInput(state.endDate || ''),
    endTime: normalizeTimeInput(state.endTime || state.endDate || ''),
    dailyPrice: state.dailyPrice || state.vehicle?.dailyPrice || '',
  };
};

export const getReservationVehicleSummaryFromLocation = (locationState) => {
  const state = locationState ?? {};
  const summary = state.vehicleSummary || state.vehicle || {};
  return {
    brand: summary.brand || '',
    model: summary.model || '',
    licensePlate: summary.licensePlate || '',
    manufactureYear: summary.manufactureYear || '',
    currentMileage: summary.currentMileage || '',
  };
};

export const mapReservationToFormData = (reservation = {}) => ({
  vehicleId: normalizeSelectValue(reservation.vehicleId ?? reservation.vehicle?.vehicleId),
  userId: normalizeSelectValue(reservation.userId ?? reservation.user?.userId),
  pickupHeadquartersId: normalizeSelectValue(reservation.pickupHeadquartersId ?? reservation.pickupHeadquarters?.id),
  returnHeadquartersId: normalizeSelectValue(reservation.returnHeadquartersId ?? reservation.returnHeadquarters?.id),
  startDate: normalizeDateInput(reservation.startDate ?? ''),
  startTime: normalizeTimeInput(reservation.startDate ?? ''),
  endDate: normalizeDateInput(reservation.endDate ?? ''),
  endTime: normalizeTimeInput(reservation.endDate ?? ''),
  reservationStatusId: normalizeSelectValue(reservation.reservationStatusId ?? reservation.reservationStatus?.reservationStatusId),
});

export const buildReservationPayload = (formData, { employeeId } = {}) => {
  const payload = {
    vehicleId: Number(formData.vehicleId),
    pickupHeadquartersId: Number(formData.pickupHeadquartersId),
    returnHeadquartersId: Number(formData.returnHeadquartersId),
    startDate: toReservationDateTime(formData.startDate, formData.startTime),
    endDate: toReservationDateTime(formData.endDate, formData.endTime),
  };
  const tieneValor = (v) => v !== undefined && v !== null && v !== '';
  if (tieneValor(formData.userId)) payload.userId = Number(formData.userId);
  if (tieneValor(formData.reservationStatusId)) payload.reservationStatusId = Number(formData.reservationStatusId);
  if (tieneValor(employeeId)) payload.employeeId = Number(employeeId);
  return payload;
};

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
  const inicio = formData.startDate ? new Date(toReservationDateTime(formData.startDate, formData.startTime)) : null;
  const fin = formData.endDate ? new Date(toReservationDateTime(formData.endDate, formData.endTime)) : null;
  if (inicio && fin && fin < inicio) errors.endDate = MESSAGES.RESERVATION_DATE_RANGE_INVALID;
  return errors;
};

export const validateReservationFormClientEdit = (formData) => {
  const errors = {};
  if (!formData.startDate) errors.startDate = MESSAGES.FIELD_REQUIRED;
  if (!formData.startTime) errors.startTime = MESSAGES.FIELD_REQUIRED;
  if (!formData.returnHeadquartersId) errors.returnHeadquartersId = MESSAGES.FIELD_REQUIRED;
  if (!formData.endDate) errors.endDate = MESSAGES.FIELD_REQUIRED;
  if (!formData.endTime) errors.endTime = MESSAGES.FIELD_REQUIRED;
  const inicio = formData.startDate ? new Date(toReservationDateTime(formData.startDate, formData.startTime)) : null;
  const fin = formData.endDate ? new Date(toReservationDateTime(formData.endDate, formData.endTime)) : null;
  if (inicio && fin && fin < inicio) errors.endDate = MESSAGES.RESERVATION_DATE_RANGE_INVALID;
  return errors;
};

const buildVehicleSummary = (vehicle = {}) => ({
  brand: vehicle.brand ?? '',
  model: vehicle.model ?? '',
  licensePlate: vehicle.licensePlate ?? '',
  manufactureYear: vehicle.manufactureYear ?? '',
  currentMileage: vehicle.currentMileage ?? '',
});

const buildBaseReservationState = (vehicle = {}) => ({
  vehicleId: vehicle.vehicleId ?? '',
  dailyPrice: vehicle.dailyPrice ?? '',
  vehicleSummary: buildVehicleSummary(vehicle),
  currentHeadquartersId: vehicle.currentHeadquartersId ?? '',
});

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
    returnTime: criteria.returnTime ?? '',
  };
};

// --- reservationSummaryUtils: duración, total, clima, selección ---
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const buildReservationDateTime = (dateValue, timeValue) => {
  const isoString = toReservationDateTime(dateValue, timeValue);
  if (!isoString) return null;
  const parsed = new Date(isoString);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const calculateDurationDays = (startDate, startTime, endDate, endTime) => {
  const start = buildReservationDateTime(startDate, startTime);
  const end = buildReservationDateTime(endDate, endTime);
  if (!start || !end || end < start) return null;
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY));
};

export const buildVehicleDetails = ({ plate, year, mileage }) => {
  const parts = [];
  if (plate) parts.push(t('RESERVATION_SUMMARY_PLATE', { plate }));
  if (year) parts.push(t('RESERVATION_SUMMARY_YEAR', { year }));
  if (mileage !== null && mileage !== undefined && mileage !== '') parts.push(t('RESERVATION_SUMMARY_MILEAGE', { mileage }));
  return parts.join(' · ');
};

export const getWeatherCityFromHeadquarters = (pickupHeadquarters, returnHeadquarters) =>
  getHeadquartersCityName(pickupHeadquarters || returnHeadquarters);

export const calculateReservationTotal = (dailyPrice, durationDays) => {
  if (!dailyPrice || !durationDays) return null;
  const numericPrice = Number(dailyPrice);
  if (!Number.isFinite(numericPrice) || !Number.isFinite(durationDays)) return null;
  return formatCurrency(numericPrice * durationDays);
};

export const isVehicleSelected = (vehicleId, selectedVehicleId) =>
  !!vehicleId && !!selectedVehicleId && String(vehicleId) === String(selectedVehicleId);

// --- reservas: etiquetas, estado, sede ---
const RESERVATION_STATUS_CLASS_BY_CANONICAL = {
  pending: 'status-maintenance',
  confirmed: 'status-available',
  canceled: 'status-rented',
  completed: 'status-available',
  active: 'status-available',
};

export const resolveReservationVehicleLabel = (reservation) => {
  const vehicle = reservation?.vehicle?.[0];
  const brand = vehicle?.brand;
  const model = vehicle?.model;
  const plate = vehicle?.licensePlate;
  if (brand || model) {
    const label = `${brand || ''} ${model || ''}`.trim();
    return plate ? `${label} · ${plate}` : label;
  }
  if (plate) return plate;
  if (reservation?.vehicleId) return `${MESSAGES.RESERVATION_VEHICLE_ID}: ${reservation.vehicleId}`;
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

export const resolveReservationStatusLabel = (reservation, statusFromLookup) => {
  const raw =
    statusFromLookup?.statusName ||
    reservation?.reservationStatus?.statusName ||
    reservation?.reservationStatus?.[0]?.statusName ||
    '';
  const messageKey = getReservationStatusMessageKey(raw);
  if (messageKey) return MESSAGES[messageKey];
  return raw || MESSAGES.NOT_AVAILABLE_SHORT;
};

export const resolveReservationStatusClass = (statusLabel) => {
  const canonical = getReservationStatusCanonical(statusLabel);
  return RESERVATION_STATUS_CLASS_BY_CANONICAL[canonical] || 'status-unknown';
};

export const resolveReservationHeadquartersDetails = (headquarters) => {
  if (!headquarters) return { name: MESSAGES.NOT_AVAILABLE_SHORT, address: '' };
  const name = getHeadquartersNameLabel(headquarters);
  const address = getHeadquartersAddressLabel(headquarters);
  if (name) return { name, address };
  if (address) return { name: address, address: '' };
  return { name: MESSAGES.NOT_AVAILABLE_SHORT, address: '' };
};
