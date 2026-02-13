import { t } from '../i18n';
import { formatCurrency } from './formatters';
import { getHeadquartersOptionLabel, getHeadquartersCityName } from '../constants/headquartersLabels';
import { MESSAGES } from '../constants';

// Constante para convertir milisegundos a días.
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Compone una fecha y hora en un objeto Date válido.
const buildReservationDateTime = (dateValue, timeValue) => {
  if (!dateValue) return null;
  const normalizedTime = timeValue && timeValue.length >= 5 ? timeValue.slice(0, 5) : '00:00';
  const composed = `${dateValue}T${normalizedTime}:00`;
  const parsed = new Date(composed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

// Calcula la duración en días (mínimo 1) entre fechas.
export const calculateDurationDays = (startDate, startTime, endDate, endTime) => {
  const start = buildReservationDateTime(startDate, startTime);
  const end = buildReservationDateTime(endDate, endTime);
  if (!start || !end || end < start) return null;
  const diffMs = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffMs / MS_PER_DAY));
};

// Genera un string con detalles del vehículo para el resumen de reserva.
export const buildVehicleDetails = ({ plate, year, mileage }) => {
  const parts = [];
  if (plate) {
    parts.push(t('RESERVATION_SUMMARY_PLATE', { plate }));
  }
  if (year) {
    parts.push(t('RESERVATION_SUMMARY_YEAR', { year }));
  }
  if (mileage !== null && mileage !== undefined && mileage !== '') {
    parts.push(t('RESERVATION_SUMMARY_MILEAGE', { mileage }));
  }
  return parts.join(' · ');
};

// Encuentra una sede por ID en un array de sedes.
export const findHeadquartersById = (headquarters, id) => {
  if (!headquarters || !id) return null;
  return headquarters.find((hq) => String(hq.id) === String(id)) || null;
};

// Obtiene el label de una sede o un fallback.
export const getHeadquartersLabel = (headquarters, { fallback = MESSAGES.NOT_AVAILABLE_SHORT } = {}) => {
  if (!headquarters) return fallback;
  return getHeadquartersOptionLabel(headquarters) || fallback;
};

// Obtiene la ciudad de una sede para el clima.
export const getWeatherCityFromHeadquarters = (pickupHeadquarters, returnHeadquarters) => {
  return getHeadquartersCityName(pickupHeadquarters || returnHeadquarters);
};

// Calcula el total estimado de una reserva.
export const calculateReservationTotal = (dailyPrice, durationDays) => {
  if (!dailyPrice || !durationDays) return null;
  const numericPrice = Number(dailyPrice);
  if (!Number.isFinite(numericPrice) || !Number.isFinite(durationDays)) return null;
  return formatCurrency(numericPrice * durationDays);
};

// Verifica si un vehículo está seleccionado comparando IDs.
export const isVehicleSelected = (vehicleId, selectedVehicleId) => {
  if (!vehicleId || !selectedVehicleId) return false;
  return String(vehicleId) === String(selectedVehicleId);
};
