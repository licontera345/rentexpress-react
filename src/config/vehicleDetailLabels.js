import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';

const pickFirst = (value) => (Array.isArray(value) ? value[0] : value);

// Resuelve la etiqueta de estado desde ids o nombres disponibles.
export const resolveStatusLabel = (vehicle) => {
  const status = pickFirst(vehicle?.vehicleStatus);
  const statusName =
    status?.statusName
    ?? status?.name
    ?? vehicle?.vehicleStatusName
    ?? vehicle?.statusName
    ?? vehicle?.status;

  if (typeof statusName === 'string' && statusName.trim()) {
    return statusName.trim();
  }

  return MESSAGES.NOT_AVAILABLE_SHORT;
};

// Obtiene la categoría del vehículo usando mapas y múltiples fuentes.
export const resolveCategoryLabel = (vehicle, categoryMap) => {
  const category = pickFirst(vehicle?.vehicleCategory);
  const fallbackLabel = category?.categoryName || '';
  if (fallbackLabel) {
    return fallbackLabel;
  }
  const categoryId = category?.categoryId ?? vehicle?.categoryId;
  if (Number.isFinite(categoryId) && categoryMap?.has(categoryId)) {
    return categoryMap.get(categoryId);
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

// Determina la sede actual del vehículo desde datos normalizados o ids.
export const resolveHeadquartersLabel = (vehicle, headquartersMap) => {
  const headquarters = pickFirst(vehicle?.currentHeadquarters);
  const fallbackLabel = getHeadquartersOptionLabel(headquarters) || '';
  if (fallbackLabel) {
    return fallbackLabel;
  }
  const headquartersId = headquarters?.id ?? vehicle?.currentHeadquartersId;
  if (Number.isFinite(headquartersId) && headquartersMap?.has(headquartersId)) {
    return headquartersMap.get(headquartersId);
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};
