import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';
import { getId, getName, normalize } from './entityNormalizers';

// Etiquetas de estado basadas en id, usadas para datos normalizados.
const STATUS_LABELS_BY_ID = {
  1: MESSAGES.AVAILABLE,
  2: MESSAGES.MAINTENANCE,
  3: MESSAGES.RENTED
};

// Resuelve la etiqueta de estado desde ids o nombres disponibles.
export const resolveStatusLabel = (vehicle) => {
  const statusId = getId(
    vehicle,
    'vehicleStatusId',
    'vehicleStatus.vehicleStatusId',
    'statusId',
    'status.vehicleStatusId'
  );
  if (STATUS_LABELS_BY_ID[statusId]) {
    return STATUS_LABELS_BY_ID[statusId];
  }

  return (
    vehicle?.statusName
    ?? vehicle?.vehicleStatus?.statusName
    ?? vehicle?.status?.statusName
    ?? vehicle?.status
    ?? MESSAGES.NOT_AVAILABLE_SHORT
  );
};

// Obtiene la categoría del vehículo usando mapas y múltiples fuentes.
export const resolveCategoryLabel = (vehicle, categoryMap) => {
  const category = normalize(
    vehicle?.category
    ?? vehicle?.vehicleCategory
    ?? vehicle?.categories
  );
  const fallbackLabel = getName(category, 'categoryName', 'name')
    || getName(vehicle, 'categoryName', 'category');
  if (fallbackLabel) {
    return fallbackLabel;
  }
  const categoryId = getId(
    category,
    'categoryId',
    'id'
  ) ?? getId(
    vehicle,
    'categoryId',
    'vehicleCategoryId',
    'vehicleCategory.categoryId',
    'vehicleCategory.id'
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
    ?? vehicle?.headquartersList
  );
  const fallbackLabel = getHeadquartersOptionLabel(headquarters)
    || vehicle?.currentHeadquartersName
    || vehicle?.headquartersName;
  if (fallbackLabel) {
    return fallbackLabel;
  }
  const headquartersId = getId(
    headquarters,
    'headquartersId',
    'id'
  ) ?? getId(
    vehicle,
    'currentHeadquartersId',
    'headquartersId'
  );
  if (Number.isFinite(headquartersId) && headquartersMap?.has(headquartersId)) {
    return headquartersMap.get(headquartersId);
  }
  return MESSAGES.NOT_AVAILABLE_SHORT;
};
