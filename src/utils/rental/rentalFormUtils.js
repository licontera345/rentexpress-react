import { toFormControlValue } from '../form/formatters';
import { MESSAGES } from '../../constants';

export const RENTAL_FORM_INITIAL_DATA = {
  startDateEffective: '',
  endDateEffective: '',
  initialKm: '',
  finalKm: '',
  rentalStatusId: '',
  totalCost: '',
  pickupHeadquartersId: '',
  returnHeadquartersId: ''
};

const toDateInput = (value) => {
  if (!value) return '';
  const str = String(value).trim();
  if (str.includes('T')) return str.slice(0, 16);
  if (str.length >= 10) return str.slice(0, 10) + 'T00:00';
  return str;
};

export const mapRentalToFormData = (rental = {}) => ({
  startDateEffective: toDateInput(rental.startDateEffective ?? rental.startDate ?? ''),
  endDateEffective: toDateInput(rental.endDateEffective ?? rental.endDate ?? ''),
  initialKm: toFormControlValue(rental.initialKm ?? ''),
  finalKm: toFormControlValue(rental.finalKm ?? ''),
  rentalStatusId: toFormControlValue(rental.rentalStatusId ?? rental.rentalStatus?.rentalStatusId ?? ''),
  totalCost: toFormControlValue(rental.totalCost ?? ''),
  pickupHeadquartersId: toFormControlValue(rental.pickupHeadquartersId ?? rental.pickupHeadquarters?.id ?? ''),
  returnHeadquartersId: toFormControlValue(rental.returnHeadquartersId ?? rental.returnHeadquarters?.id ?? '')
});

const toDateTimeISO = (v) => {
  const s = v?.trim();
  if (!s) return undefined;
  if (s.length === 16 && s[10] === 'T') return `${s}:00`;
  return s;
};

export const buildRentalPayload = (formData) => {
  const payload = {
    startDateEffective: toDateTimeISO(formData.startDateEffective) || undefined,
    endDateEffective: toDateTimeISO(formData.endDateEffective) || undefined,
    rentalStatusId: formData.rentalStatusId ? Number(formData.rentalStatusId) : undefined,
    pickupHeadquartersId: formData.pickupHeadquartersId ? Number(formData.pickupHeadquartersId) : undefined,
    returnHeadquartersId: formData.returnHeadquartersId ? Number(formData.returnHeadquartersId) : undefined
  };
  const initialKm = formData.initialKm !== '' && formData.initialKm != null ? Number(formData.initialKm) : undefined;
  const finalKm = formData.finalKm !== '' && formData.finalKm != null ? Number(formData.finalKm) : undefined;
  const totalCost = formData.totalCost !== '' && formData.totalCost != null ? Number(formData.totalCost) : undefined;
  if (initialKm !== undefined) payload.initialKm = initialKm;
  if (finalKm !== undefined) payload.finalKm = finalKm;
  if (totalCost !== undefined) payload.totalCost = totalCost;
  return payload;
};

export const validateRentalForm = (formData) => {
  const errors = {};
  if (!formData.startDateEffective?.trim()) errors.startDateEffective = MESSAGES.FIELD_REQUIRED;
  if (!formData.endDateEffective?.trim()) errors.endDateEffective = MESSAGES.FIELD_REQUIRED;
  if (!formData.pickupHeadquartersId) errors.pickupHeadquartersId = MESSAGES.FIELD_REQUIRED;
  if (!formData.returnHeadquartersId) errors.returnHeadquartersId = MESSAGES.FIELD_REQUIRED;
  const start = formData.startDateEffective ? new Date(formData.startDateEffective) : null;
  const end = formData.endDateEffective ? new Date(formData.endDateEffective) : null;
  if (start && end && end < start) errors.endDateEffective = MESSAGES.RESERVATION_DATE_RANGE_INVALID;
  const totalCost = formData.totalCost !== '' && formData.totalCost != null ? Number(formData.totalCost) : NaN;
  if (!Number.isNaN(totalCost) && totalCost < 0) errors.totalCost = MESSAGES.INVALID_TOTAL_COST;
  const initialKm = formData.initialKm !== '' && formData.initialKm != null ? Number(formData.initialKm) : NaN;
  const finalKm = formData.finalKm !== '' && formData.finalKm != null ? Number(formData.finalKm) : NaN;
  if (!Number.isNaN(initialKm) && !Number.isNaN(finalKm) && finalKm < initialKm) errors.finalKm = MESSAGES.FINAL_KM_LESS_THAN_INITIAL;
  return errors;
};
