import { FILTER_DEFAULTS, MESSAGES } from './constants';
import { headquartersOptionsForFilters } from '../utils/headquartersUtils';

// Valores por defecto de filtros de vehículo.
const BASE_VEHICLE_FILTERS = {
  ...FILTER_DEFAULTS,
  model: '',
  currentHeadquartersId: '',
  manufactureYearFrom: '',
  manufactureYearTo: '',
  currentMileageMin: '',
  currentMileageMax: ''
};

/** Devuelve el set de filtros iniciales según necesidades del formulario. */
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
  if (includeStatus) defaults.vehicleStatusId = '';
  if (includeActiveStatus) defaults.activeStatus = '';
  return defaults;
};

// Año actual para rangos por defecto.
const CURRENT_YEAR = new Date().getFullYear();

// Rangos configurados para los filtros numéricos.
const DEFAULT_RANGES = {
  manufactureYearFrom: {
    min: 1990,
    max: CURRENT_YEAR,
    step: 1,
    fallbackValue: 1990
  },
  manufactureYearTo: {
    min: 1990,
    max: CURRENT_YEAR,
    step: 1,
    fallbackValue: CURRENT_YEAR
  },
  currentMileageMin: {
    min: 0,
    max: 200000,
    step: 1000,
    fallbackValue: 0
  },
  currentMileageMax: {
    min: 0,
    max: 200000,
    step: 1000,
    fallbackValue: 200000
  },
  minPrice: {
    min: 0,
    max: 500,
    step: 1,
    fallbackValue: 0
  },
  maxPrice: {
    min: 0,
    max: 500,
    step: 1,
    fallbackValue: 500
  }
};

// Convierte categorías en opciones de select.
const buildCategoryOptions = (categories) => (
  categories.map((category) => ({
    value: category.categoryId,
    label: category.categoryName
  }))
);

// Convierte estados de vehículo en opciones de select.
const buildStatusOptions = (statuses) => (
  statuses.map((status) => ({
    value: status.vehicleStatusId,
    label: status.statusName
  }))
);

// Define los campos de filtros de vehículos según configuración.
export const buildVehicleFilterFields = ({
  categories = [],
  statuses = [],
  headquarters = [],
  headquartersOptions = [],
  includeIdentifiers = true,
  includeStatus = true,
  includeActiveStatus = true,
  includeHeadquarters = true,
  brandOptions = null
} = {}) => {
  const resolvedHeadquartersOptions = headquarters.length
    ? headquartersOptionsForFilters(headquarters)
    : headquartersOptions;
  const fields = [
    {
      name: 'brand',
      label: MESSAGES.BRAND,
      type: 'text',
      placeholder: MESSAGES.PLACEHOLDER_BRAND,
      datalist: brandOptions?.length ? brandOptions : undefined
    },
    {
      name: 'model',
      label: MESSAGES.MODEL,
      type: 'text',
      placeholder: MESSAGES.MODEL_PLACEHOLDER
    }
  ];

  if (includeIdentifiers) {
    fields.push(
      {
        name: 'licensePlate',
        label: MESSAGES.LICENSE_PLATE,
        type: 'text',
        placeholder: MESSAGES.LICENSE_PLATE_PLACEHOLDER
      },
      {
        name: 'vinNumber',
        label: MESSAGES.VIN,
        type: 'text',
        placeholder: MESSAGES.VIN_PLACEHOLDER
      }
    );
  }

  fields.push({
    name: 'categoryId',
    label: MESSAGES.CATEGORY,
    type: 'select',
    placeholder: MESSAGES.ALL_CATEGORIES,
    options: buildCategoryOptions(categories)
  });

  if (includeStatus) {
    fields.push({
      name: 'vehicleStatusId',
      label: MESSAGES.STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL_STATUSES,
      options: buildStatusOptions(statuses)
    });
  }

  if (includeHeadquarters) {
    fields.push({
      name: 'currentHeadquartersId',
      label: MESSAGES.HEADQUARTERS_LABEL,
      type: 'select',
      placeholder: MESSAGES.SELECT_LOCATION,
      options: resolvedHeadquartersOptions
    });
  }

  fields.push(
    {
      name: 'manufactureYearFrom',
      label: `${MESSAGES.YEAR} ${MESSAGES.FROM}`,
      type: 'range',
      placeholder: MESSAGES.YEAR_FROM,
      ...DEFAULT_RANGES.manufactureYearFrom
    },
    {
      name: 'manufactureYearTo',
      label: `${MESSAGES.YEAR} ${MESSAGES.TO}`,
      type: 'range',
      placeholder: MESSAGES.YEAR_TO,
      ...DEFAULT_RANGES.manufactureYearTo
    },
    {
      name: 'currentMileageMin',
      label: `${MESSAGES.MILEAGE} ${MESSAGES.FROM}`,
      type: 'range',
      placeholder: MESSAGES.MIN_PLACEHOLDER,
      ...DEFAULT_RANGES.currentMileageMin
    },
    {
      name: 'currentMileageMax',
      label: `${MESSAGES.MILEAGE} ${MESSAGES.TO}`,
      type: 'range',
      placeholder: MESSAGES.MAX_PLACEHOLDER,
      ...DEFAULT_RANGES.currentMileageMax
    },
    {
      name: 'minPrice',
      label: MESSAGES.MIN_PRICE,
      type: 'range',
      placeholder: MESSAGES.MIN_PLACEHOLDER,
      ...DEFAULT_RANGES.minPrice
    },
    {
      name: 'maxPrice',
      label: MESSAGES.MAX_PRICE,
      type: 'range',
      placeholder: MESSAGES.MAX_PLACEHOLDER,
      ...DEFAULT_RANGES.maxPrice
    }
  );

  if (includeActiveStatus) {
    fields.push({
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: [
        { value: '1', label: MESSAGES.ACTIVE },
        { value: '0', label: MESSAGES.INACTIVE }
      ]
    });
  }

  return fields;
};
