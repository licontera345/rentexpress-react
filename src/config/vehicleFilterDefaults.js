import { FILTER_DEFAULTS } from '../constants';

const BASE_VEHICLE_FILTERS = {
  ...FILTER_DEFAULTS,
  model: '',
  currentHeadquartersId: '',
  manufactureYearFrom: '',
  manufactureYearTo: '',
  currentMileageMin: '',
  currentMileageMax: ''
};

export const getVehicleFilterDefaults = ({
  includeIdentifiers = false,
  includeStatus = false,
  includeActiveStatus = false
} = {}) => {
  const defaults = { ...BASE_VEHICLE_FILTERS };

  if (includeIdentifiers) {
    defaults.licensePlate = '';
    defaults.vinNumber = '';
  }

  if (includeStatus) {
    defaults.vehicleStatusId = '';
  }

  if (includeActiveStatus) {
    defaults.activeStatus = '';
  }

  return defaults;
};
