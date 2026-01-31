import { MESSAGES } from '../constants';

const CURRENT_YEAR = new Date().getFullYear();

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

const buildCategoryOptions = (categories) => (
  categories.map((category) => ({
    value: category.categoryId ?? category.id,
    label: category.categoryName ?? category.name
  }))
);

const buildStatusOptions = (statuses) => (
  statuses.map((status) => ({
    value: status.vehicleStatusId ?? status.id,
    label: status.statusName ?? status.name
  }))
);

export const buildVehicleFilterFields = ({
  categories = [],
  statuses = [],
  headquartersOptions = [],
  includeIdentifiers = true,
  includeStatus = true,
  includeActiveStatus = true,
  includeHeadquarters = true,
  brandOptions = null
} = {}) => {
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
      options: headquartersOptions
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
