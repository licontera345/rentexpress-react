import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';

// Resuelve la etiqueta de estado según el esquema real de VehicleDTO del backend.
export const resolveStatusLabel = (vehicle, statusMap) => {
  const status = Array.isArray(vehicle?.vehicleStatus)
    ? vehicle.vehicleStatus[0]
    : null;

  if (typeof status?.statusName === 'string' && status.statusName.trim()) {
    return status.statusName.trim();
  }

  const statusId = vehicle?.vehicleStatusId ?? status?.vehicleStatusId;
  if (Number.isFinite(statusId) && statusMap?.has(statusId)) {
    return statusMap.get(statusId);
  }

  return MESSAGES.NOT_AVAILABLE_SHORT;
};

// Obtiene la categoría del vehículo usando el esquema real del backend.
export const resolveCategoryLabel = (vehicle, categoryMap) => {
  const category = Array.isArray(vehicle?.vehicleCategory)
    ? vehicle.vehicleCategory[0]
    : null;

  if (typeof category?.categoryName === 'string' && category.categoryName.trim()) {
    return category.categoryName.trim();
  }

  const categoryId = vehicle?.categoryId ?? category?.categoryId;
  if (Number.isFinite(categoryId) && categoryMap?.has(categoryId)) {
    return categoryMap.get(categoryId);
  }

  return MESSAGES.NOT_AVAILABLE_SHORT;
};

// Determina la sede actual del vehículo desde los campos definidos en VehicleDTO.
export const resolveHeadquartersLabel = (vehicle, headquartersMap) => {
  const headquarters = Array.isArray(vehicle?.currentHeadquarters)
    ? vehicle.currentHeadquarters[0]
    : null;

  const label = getHeadquartersOptionLabel(headquarters);
  if (label) {
    return label;
  }

  const headquartersId = vehicle?.currentHeadquartersId ?? headquarters?.id;
  if (Number.isFinite(headquartersId) && headquartersMap?.has(headquartersId)) {
    return headquartersMap.get(headquartersId);
  }

  return MESSAGES.NOT_AVAILABLE_SHORT;
};
