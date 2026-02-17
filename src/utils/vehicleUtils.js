/**
 * Barrel: re-exporta utilidades de vehículos desde módulos especializados.
 * Para imports directos, usa los archivos en utils/vehicle/.
 */
export {
  buildVehicleStatusMap,
  resolveStatusLabel,
  resolveCategoryLabel,
  resolveHeadquartersLabel,
  formatVehicleForDetail,
  getVehicleInitials,
  resolveVehicleStatus,
  formatVehicleListItemData,
  buildVehicleLabel,
  buildVehicleTitle,
  filterVehiclesBySearchTerm,
  getUniqueBrandsFromVehicles,
} from './vehicle/vehicleDisplayUtils';

export {
  DEFAULT_VEHICLE_FORM_DATA,
  mapVehicleToFormData,
  buildVehiclePayload,
} from './vehicle/vehicleFormUtils';

export {
  buildVehicleSearchCriteria,
  buildEmployeeVehicleSearchCriteria,
} from './vehicle/vehicleSearchUtils';

export {
  getPrimaryImage,
  validateVehicleImageFile,
  uploadVehicleImageFile,
} from './vehicle/vehicleImageUtils';
