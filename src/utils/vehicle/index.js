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
} from './vehicleDisplayUtils';

export {
  DEFAULT_VEHICLE_FORM_DATA,
  mapVehicleToFormData,
  buildVehiclePayload,
} from './vehicleFormUtils';

export {
  buildVehicleSearchCriteria,
  buildEmployeeVehicleSearchCriteria,
} from './vehicleSearchUtils';

export {
  getPrimaryImage,
  validateVehicleImageFile,
  uploadVehicleImageFile,
} from './vehicleImageUtils';
