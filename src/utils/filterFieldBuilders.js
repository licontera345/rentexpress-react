import { MESSAGES, FILTER_DEFAULTS, getVehicleFilterDefaults } from '../constants';

export { getVehicleFilterDefaults };
import { headquartersOptionsForFilters } from './headquartersUtils';
import { getReservationStatusMessageKey } from './reservationUtils';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_RANGES = {
  manufactureYearFrom: { min: 1990, max: CURRENT_YEAR, step: 1, fallbackValue: 1990 },
  manufactureYearTo: { min: 1990, max: CURRENT_YEAR, step: 1, fallbackValue: CURRENT_YEAR },
  currentMileageMin: { min: 0, max: 200000, step: 1000, fallbackValue: 0 },
  currentMileageMax: { min: 0, max: 200000, step: 1000, fallbackValue: 200000 },
  minPrice: { min: 0, max: 500, step: 1, fallbackValue: 0 },
  maxPrice: { min: 0, max: 500, step: 1, fallbackValue: 500 },
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
} = {}) => {
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
    { name: 'manufactureYearFrom', label: `${MESSAGES.YEAR} ${MESSAGES.FROM}`, type: 'range', placeholder: MESSAGES.YEAR_FROM, ...DEFAULT_RANGES.manufactureYearFrom },
    { name: 'manufactureYearTo', label: `${MESSAGES.YEAR} ${MESSAGES.TO}`, type: 'range', placeholder: MESSAGES.YEAR_TO, ...DEFAULT_RANGES.manufactureYearTo },
    { name: 'currentMileageMin', label: `${MESSAGES.MILEAGE} ${MESSAGES.FROM}`, type: 'range', placeholder: MESSAGES.MIN_PLACEHOLDER, ...DEFAULT_RANGES.currentMileageMin },
    { name: 'currentMileageMax', label: `${MESSAGES.MILEAGE} ${MESSAGES.TO}`, type: 'range', placeholder: MESSAGES.MAX_PLACEHOLDER, ...DEFAULT_RANGES.currentMileageMax },
    { name: 'minPrice', label: MESSAGES.MIN_PRICE, type: 'range', placeholder: MESSAGES.MIN_PLACEHOLDER, ...DEFAULT_RANGES.minPrice },
    { name: 'maxPrice', label: MESSAGES.MAX_PRICE, type: 'range', placeholder: MESSAGES.MAX_PLACEHOLDER, ...DEFAULT_RANGES.maxPrice }
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
  statuses.map((s) => ({ value: s.rentalStatusId, label: s?.statusName ?? s?.name ?? '' }));

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

export const buildEmployeeFilterFields = () => [
  { name: 'employeeId', label: MESSAGES.EMPLOYEE_ID, type: 'number', placeholder: MESSAGES.EMPLOYEE_ID },
  { name: 'firstName', label: MESSAGES.FIRST_NAME, type: 'text', placeholder: MESSAGES.FIRST_NAME },
  { name: 'lastName1', label: MESSAGES.LAST_NAME_1, type: 'text', placeholder: MESSAGES.LAST_NAME_1_PLACEHOLDER },
  { name: 'email', label: MESSAGES.EMAIL, type: 'text', placeholder: MESSAGES.EMAIL },
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

export const buildUserFilterFields = () => [
  { name: 'userId', label: MESSAGES.USER_ID, type: 'number', placeholder: MESSAGES.USER_ID },
  { name: 'username', label: MESSAGES.USERNAME, type: 'text', placeholder: MESSAGES.USERNAME },
  { name: 'firstName', label: MESSAGES.FIRST_NAME, type: 'text', placeholder: MESSAGES.FIRST_NAME },
  { name: 'lastName1', label: MESSAGES.LAST_NAME_1, type: 'text', placeholder: MESSAGES.LAST_NAME_1_PLACEHOLDER },
  { name: 'email', label: MESSAGES.EMAIL, type: 'text', placeholder: MESSAGES.EMAIL },
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
