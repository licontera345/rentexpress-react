// --- Filter defaults & pagination ---
export const FILTER_DEFAULTS = {
  brand: '',
  minPrice: '',
  maxPrice: '',
  categoryId: '',
  provinceId: '',
  cityId: '',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_PAGE_SIZE_LARGE: 100,
  SEARCH_PAGE_SIZE: 25,
  MAX_BUTTONS: 5,
  MAX_PAGE_SIZE: 1000,
};

export const PAGINATION_ELLIPSIS = '...';

// --- Home ---
export const HOME_TRUST_ITEMS = [
  { label: 'Trustpilot', rating: '4,6' },
  { label: 'Google', rating: '4,5' },
  { label: 'Review Centre', rating: '4,2' },
  { label: 'Reviews.io', rating: '4,4' },
];

export const HOME_STATS_VALUES = {
  COUNTRIES: '164',
  LOCATIONS: '50 000+',
  PARTNERS: '1000+',
  LANGUAGES: '33',
};

// --- Headquarters labels ---
const resolveHeadquartersName = (headquarters) => headquarters?.name || '';

// Resuelve la dirección de la sede.
const resolveHeadquartersAddress = (headquarters) => {
  const address = headquarters?.addresses?.[0];
  const street = address?.street;
  const number = address?.number;
  const cityName = address?.cityName || headquarters?.city?.cityName;
  const provinceName = address?.provinceName || headquarters?.province?.provinceName;
  const streetLine = [street, number].filter(Boolean).join(' ');
  const locationLine = [cityName, provinceName].filter(Boolean).join(', ');
  return [streetLine, locationLine].filter(Boolean).join(', ');
};

// Obtiene la etiqueta de la sede.
export const getHeadquartersOptionLabel = (headquarters) => {
  const name = resolveHeadquartersName(headquarters);
  const address = resolveHeadquartersAddress(headquarters);
  if (name && address) return `${name} - ${address}`;
  return name || address || '';
};

// Obtiene el nombre de la sede.  
export const getHeadquartersNameLabel = (headquarters) => resolveHeadquartersName(headquarters) || '';

// Obtiene la dirección de la sede.
export const getHeadquartersAddressLabel = (headquarters) => resolveHeadquartersAddress(headquarters) || '';

// Obtiene el nombre de la ciudad de la sede.
export const getHeadquartersCityName = (headquarters) => {
  const address = headquarters?.addresses?.[0];
  return address?.cityName || headquarters?.city?.cityName || '';
};

// --- Vehicle filter fields ---
const BASE_VEHICLE_FILTERS = {
  ...FILTER_DEFAULTS,
  model: '',
  currentHeadquartersId: '',
  manufactureYearFrom: '',
  manufactureYearTo: '',
  currentMileageMin: '',
  currentMileageMax: '',
};

export const getVehicleFilterDefaults = ({
  includeIdentifiers = false,
  includeStatus = false,
  includeActiveStatus = false,
} = {}) => {
  const defaults = { ...BASE_VEHICLE_FILTERS };
  if (includeIdentifiers) {
    defaults.licensePlate = '';
    defaults.vinNumber = '';
  }
  if (includeStatus) defaults.vehicleStatusId = '';
  if (includeActiveStatus) defaults.activeStatus = '';
  return defaults;
};

