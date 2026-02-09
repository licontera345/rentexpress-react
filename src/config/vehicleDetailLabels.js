import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';
import { getId, getName, normalize } from './entityNormalizers';

// Resuelve la etiqueta de estado desde ids o nombres disponibles.
export const resolveStatusLabel = (vehicle) => {
  const status = normalize(vehicle?.vehicleStatus ?? vehicle?.status);
  const statusName = getName(status, 'statusName');
  return statusName || vehicle?.statusName || MESSAGES.NOT_AVAILABLE_SHORT;
};

// Obtiene la categoría del vehículo usando mapas y múltiples fuentes.
export const resolveCategoryLabel = (vehicle, categoryMap) => {
  const category = normalize(
    vehicle?.vehicleCategory
    ?? vehicle?.category
    ?? vehicle?.categories
  );
  const fallbackLabel = getName(category, 'categoryName')
    || getName(vehicle, 'categoryName');
  if (fallbackLabel) {
    return fallbackLabel;
  }
  const categoryId = getId(
    category,
    'categoryId'
  ) ?? getId(
    vehicle,
    'categoryId'
  );
  if (Number.isFinite(categoryId) && categoryMap?.has(categoryId)) {
    return categoryMap.get(categoryId);
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};

// Determina la sede actual del vehículo desde datos normalizados o ids.
export const resolveHeadquartersLabel = (vehicle, headquartersMap) => {
  const headquarters = normalize(
    vehicle?.currentHeadquarters
    ?? vehicle?.headquarters
  );
  const fallbackLabel = getHeadquartersOptionLabel(headquarters)
    || vehicle?.currentHeadquartersName;
  if (fallbackLabel) {
    return fallbackLabel;
  }
  const headquartersId = getId(
    headquarters,
    'id'
  ) ?? getId(
    vehicle,
    'currentHeadquartersId'
  );
  if (Number.isFinite(headquartersId) && headquartersMap?.has(headquartersId)) {
    return headquartersMap.get(headquartersId);
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};
