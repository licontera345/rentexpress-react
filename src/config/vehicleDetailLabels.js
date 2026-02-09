import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';

// Resuelve la etiqueta de estado desde ids o nombres disponibles.
export const resolveStatusLabel = (vehicle) => {
  const status = vehicle?.vehicleStatus?.[0];
  const statusName = status?.statusName;
  return statusName || MESSAGES.NOT_AVAILABLE_SHORT;
};

// Obtiene la categoría del vehículo usando mapas y múltiples fuentes.
export const resolveCategoryLabel = (vehicle, categoryMap) => {
  const category = vehicle?.vehicleCategory?.[0];
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
  const headquarters = vehicle?.currentHeadquarters?.[0];
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
