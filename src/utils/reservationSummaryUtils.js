import { t } from '../i18n';
import { formatCurrency } from './formatters';
import { getHeadquartersCityName } from '../constants/headquartersLabels';
import { toReservationDateTime } from './reservationFormUtils';

// Constante para convertir milisegundos a días.
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Convierte fecha+hora del formulario a Date (reutiliza toReservationDateTime).
const buildReservationDateTime = (dateValue, timeValue) => {
  const isoString = toReservationDateTime(dateValue, timeValue);
  if (!isoString) return null;
  const parsed = new Date(isoString);
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
