import { MESSAGES, FILTER_DEFAULTS, getVehicleFilterDefaults } from '../../constants';

export { getVehicleFilterDefaults };
import { headquartersOptionsForFilters } from '../location/headquartersUtils';
import { getReservationStatusMessageKey } from '../reservation/reservationUtils';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_RANGES = {
  manufactureYearFrom: { min: 1990, max: CURRENT_YEAR, step: 1, fallbackValue: 1990 },
  manufactureYearTo: { min: 1990, max: CURRENT_YEAR, step: 1, fallbackValue: CURRENT_YEAR },
  currentMileageMin: { min: 0, max: 200000, step: 1000, fallbackValue: 0 },
  currentMileageMax: { min: 0, max: 200000, step: 1000, fallbackValue: 200000 },
  minPrice: { min: 0, max: 500, step: 1, fallbackValue: 0 },
  maxPrice: { min: 0, max: 500, step: 1, fallbackValue: 500 },
};

const mapApiFilterRangesToRanges = (api) => {
  if (!api) return null;
  const year = api.manufactureYear;
  const mileage = api.mileage;
  const price = api.dailyPrice;
  if (!year || year.min == null || year.max == null || !mileage || mileage.min == null || mileage.max == null || !price || price.min == null || price.max == null) return null;
  return {
    manufactureYearFrom: { min: year.min, max: year.max, step: 1, fallbackValue: year.min },
    manufactureYearTo: { min: year.min, max: year.max, step: 1, fallbackValue: year.max },
    currentMileageMin: { min: mileage.min, max: mileage.max, step: 1000, fallbackValue: mileage.min },
    currentMileageMax: { min: mileage.min, max: mileage.max, step: 1000, fallbackValue: mileage.max },
    minPrice: { min: price.min, max: price.max, step: 1, fallbackValue: price.min },
    maxPrice: { min: price.min, max: price.max, step: 1, fallbackValue: price.max },
  };
};

const buildCategoryOptions = (categories) =>
  categories.map((cat) => ({ value: cat.categoryId, label: cat.categoryName }));

const buildVehicleStatusOptions = (statuses) =>
  statuses.map((s) => ({ value: s.vehicleStatusId, label: s.statusName }));

export const buildVehicleFilterFields = ({
  categories = [],
  statuses = [],
  headquarters = [],
  headquartersOptions = [],
  includeIdentifiers = true,
  includeStatus = true,
  includeActiveStatus = true,
  includeHeadquarters = true,
  brandOptions = null,
  filterRangesFromApi = null,
} = {}) => {
  const ranges = mapApiFilterRangesToRanges(filterRangesFromApi) || DEFAULT_RANGES;
  const resolvedHeadquartersOptions = headquarters.length
    ? headquartersOptionsForFilters(headquarters)
    : headquartersOptions;
  const fields = [
    { name: 'brand', label: MESSAGES.BRAND, type: 'text', placeholder: MESSAGES.PLACEHOLDER_BRAND, datalist: brandOptions?.length ? brandOptions : undefined },
    { name: 'model', label: MESSAGES.MODEL, type: 'text', placeholder: MESSAGES.MODEL_PLACEHOLDER },
  ];
  if (includeIdentifiers) {
    fields.push(
      { name: 'licensePlate', label: MESSAGES.LICENSE_PLATE, type: 'text', placeholder: MESSAGES.LICENSE_PLATE_PLACEHOLDER },
      { name: 'vinNumber', label: MESSAGES.VIN, type: 'text', placeholder: MESSAGES.VIN_PLACEHOLDER }
    );
  }
  fields.push({
    name: 'categoryId',
    label: MESSAGES.CATEGORY,
    type: 'select',
    placeholder: MESSAGES.ALL_CATEGORIES,
    options: buildCategoryOptions(categories),
  });
  if (includeStatus) {
    fields.push({
      name: 'vehicleStatusId',
      label: MESSAGES.STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL_STATUSES,
      options: buildVehicleStatusOptions(statuses),
    });
  }
  if (includeHeadquarters) {
    fields.push({
      name: 'currentHeadquartersId',
      label: MESSAGES.HEADQUARTERS_LABEL,
      type: 'select',
      placeholder: MESSAGES.SELECT_LOCATION,
      options: resolvedHeadquartersOptions,
    });
  }
  fields.push(
    { name: 'manufactureYearFrom', label: `${MESSAGES.YEAR} ${MESSAGES.FROM}`, type: 'range', placeholder: MESSAGES.YEAR_FROM, ...ranges.manufactureYearFrom },
    { name: 'manufactureYearTo', label: `${MESSAGES.YEAR} ${MESSAGES.TO}`, type: 'range', placeholder: MESSAGES.YEAR_TO, ...ranges.manufactureYearTo },
    { name: 'currentMileageMin', label: `${MESSAGES.MILEAGE} ${MESSAGES.FROM}`, type: 'range', placeholder: MESSAGES.MIN_PLACEHOLDER, ...ranges.currentMileageMin },
    { name: 'currentMileageMax', label: `${MESSAGES.MILEAGE} ${MESSAGES.TO}`, type: 'range', placeholder: MESSAGES.MAX_PLACEHOLDER, ...ranges.currentMileageMax },
    { name: 'minPrice', label: MESSAGES.MIN_PRICE, type: 'range', placeholder: MESSAGES.MIN_PLACEHOLDER, ...ranges.minPrice },
    { name: 'maxPrice', label: MESSAGES.MAX_PRICE, type: 'range', placeholder: MESSAGES.MAX_PLACEHOLDER, ...ranges.maxPrice }
  );
  if (includeActiveStatus) {
    fields.push({
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: [
        { value: '1', label: MESSAGES.ACTIVE },
        { value: '0', label: MESSAGES.INACTIVE },
      ],
    });
  }
  return fields;
};

const buildReservationStatusOptions = (statuses) =>
  statuses.map((status) => ({
    value: status.reservationStatusId,
    label: (() => {
      const key = getReservationStatusMessageKey(status.statusName);
      return key ? MESSAGES[key] : status.statusName;
    })(),
  }));

export const buildReservationFilterFields = ({ statuses = [], headquarters = [] } = {}) => [
  { name: 'reservationId', label: MESSAGES.RESERVATION_ID, type: 'number', placeholder: MESSAGES.RESERVATION_ID },
  { name: 'vehicleId', label: MESSAGES.VEHICLE_ID, type: 'number', placeholder: MESSAGES.VEHICLE_ID },
  { name: 'userId', label: MESSAGES.CUSTOMER_ID, type: 'number', placeholder: MESSAGES.CUSTOMER_ID_PLACEHOLDER },
  {
    name: 'reservationStatusId',
    label: MESSAGES.RESERVATION_STATUS_LABEL,
    type: 'select',
    placeholder: MESSAGES.ALL_STATUSES,
    options: buildReservationStatusOptions(statuses),
  },
  {
    name: 'pickupHeadquartersId',
    label: MESSAGES.PICKUP_LOCATION,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: headquartersOptionsForFilters(headquarters),
  },
  {
    name: 'returnHeadquartersId',
    label: MESSAGES.RETURN_LOCATION,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: headquartersOptionsForFilters(headquarters),
  },
  { name: 'startDateFrom', label: `${MESSAGES.PICKUP_DATE} ${MESSAGES.FROM}`, type: 'date', placeholder: MESSAGES.DATE_FROM },
  { name: 'startDateTo', label: `${MESSAGES.PICKUP_DATE} ${MESSAGES.TO}`, type: 'date', placeholder: MESSAGES.DATE_TO },
  { name: 'endDateFrom', label: `${MESSAGES.RETURN_DATE} ${MESSAGES.FROM}`, type: 'date', placeholder: MESSAGES.DATE_FROM },
  { name: 'endDateTo', label: `${MESSAGES.RETURN_DATE} ${MESSAGES.TO}`, type: 'date', placeholder: MESSAGES.DATE_TO },
];

const buildRentalStatusOptions = (statuses) =>
  statuses.map((s) => ({ value: s.rentalStatusId, label: s?.statusName || '' }));

export const buildRentalFilterFields = ({ statuses = [], headquarters = [] } = {}) => [
  { name: 'rentalId', label: MESSAGES.RENTAL_ID, type: 'number', placeholder: MESSAGES.RENTAL_ID },
  {
    name: 'rentalStatusId',
    label: MESSAGES.RENTAL_STATUS_LABEL,
    type: 'select',
    placeholder: MESSAGES.ALL_STATUSES,
    options: buildRentalStatusOptions(statuses),
  },
  {
    name: 'pickupHeadquartersId',
    label: MESSAGES.PICKUP_LOCATION,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: headquartersOptionsForFilters(headquarters),
  },
  {
    name: 'returnHeadquartersId',
    label: MESSAGES.RETURN_LOCATION,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: headquartersOptionsForFilters(headquarters),
  },
  { name: 'startDateEffectiveFrom', label: `${MESSAGES.PICKUP_DATE} ${MESSAGES.FROM}`, type: 'date', placeholder: MESSAGES.DATE_FROM },
  { name: 'startDateEffectiveTo', label: `${MESSAGES.PICKUP_DATE} ${MESSAGES.TO}`, type: 'date', placeholder: MESSAGES.DATE_TO },
  { name: 'endDateEffectiveFrom', label: `${MESSAGES.RETURN_DATE} ${MESSAGES.FROM}`, type: 'date', placeholder: MESSAGES.DATE_FROM },
  { name: 'endDateEffectiveTo', label: `${MESSAGES.RETURN_DATE} ${MESSAGES.TO}`, type: 'date', placeholder: MESSAGES.DATE_TO },
];

const buildRoleOptions = (roles = []) =>
  roles.map((r) => ({ value: String(r.roleId), label: r.roleName || '' }));

export const buildEmployeeFilterFields = ({ roles = [], headquarters = [] } = {}) => {
  const headquartersOptions = headquartersOptionsForFilters(headquarters);
  return [
    { name: 'employeeId', label: MESSAGES.EMPLOYEE_ID, type: 'number', placeholder: MESSAGES.EMPLOYEE_ID },
    { name: 'employeeName', label: MESSAGES.EMPLOYEE_NAME_LABEL, type: 'text', placeholder: MESSAGES.USERNAME_PLACEHOLDER },
    { name: 'firstName', label: MESSAGES.FIRST_NAME, type: 'text', placeholder: MESSAGES.FIRST_NAME_PLACEHOLDER },
    { name: 'lastName1', label: MESSAGES.LAST_NAME_1, type: 'text', placeholder: MESSAGES.LAST_NAME_1_PLACEHOLDER },
    { name: 'lastName2', label: MESSAGES.LAST_NAME_2, type: 'text', placeholder: MESSAGES.LAST_NAME_2_PLACEHOLDER },
    { name: 'email', label: MESSAGES.EMAIL, type: 'text', placeholder: MESSAGES.EMAIL_PLACEHOLDER },
    { name: 'phone', label: MESSAGES.PHONE, type: 'text', placeholder: MESSAGES.PHONE_PLACEHOLDER },
    {
      name: 'roleId',
      label: MESSAGES.EMPLOYEE_POSITION_LABEL,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: buildRoleOptions(roles),
    },
    {
      name: 'headquartersId',
      label: MESSAGES.HEADQUARTERS_LABEL,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: headquartersOptions,
    },
    {
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: [
        { value: '1', label: MESSAGES.ACTIVE },
        { value: '0', label: MESSAGES.INACTIVE },
      ],
    },
  ];
};

export const buildUserFilterFields = ({ roles = [], includeRole = true } = {}) => {
  const base = [
    { name: 'userId', label: MESSAGES.USER_ID, type: 'number', placeholder: MESSAGES.USER_ID },
    { name: 'username', label: MESSAGES.USERNAME, type: 'text', placeholder: MESSAGES.USERNAME_PLACEHOLDER },
    { name: 'firstName', label: MESSAGES.FIRST_NAME, type: 'text', placeholder: MESSAGES.FIRST_NAME_PLACEHOLDER },
    { name: 'lastName1', label: MESSAGES.LAST_NAME_1, type: 'text', placeholder: MESSAGES.LAST_NAME_1_PLACEHOLDER },
    { name: 'lastName2', label: MESSAGES.LAST_NAME_2, type: 'text', placeholder: MESSAGES.LAST_NAME_2_PLACEHOLDER },
    { name: 'email', label: MESSAGES.EMAIL, type: 'text', placeholder: MESSAGES.EMAIL_PLACEHOLDER },
    { name: 'phone', label: MESSAGES.PHONE, type: 'text', placeholder: MESSAGES.PHONE_PLACEHOLDER },
    ...(includeRole
      ? [
          {
            name: 'roleId',
            label: MESSAGES.ROLE_LABEL,
            type: 'select',
            placeholder: MESSAGES.ALL,
            options: buildRoleOptions(roles),
          },
        ]
      : []),
    {
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: [
        { value: '1', label: MESSAGES.ACTIVE },
        { value: '0', label: MESSAGES.INACTIVE },
      ],
    },
  ];
  return base;
};
