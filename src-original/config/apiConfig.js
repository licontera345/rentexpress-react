import { normalizeIsoCodeForApi } from './isoCode';

const defaultBaseUrl = import.meta.env.DEV
  ? '/rentexpress-rest-api/api'
  : 'http://localhost:8081/rentexpress-rest-api/api';

const Config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl,

  AUTH: {
    LOGIN_USER: '/users/open/authenticate',
    LOGIN_EMPLOYEE: '/employees/open/authenticate',
    FORGOT_PASSWORD: '/users/open/forgot-password',
    RESET_PASSWORD: '/users/open/reset-password'
  },

  USERS: {
    CREATE_OPEN: '/users/open',
    BY_ID: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    SEARCH: '/users/search',
    ACTIVATE: (id) => `/users/${id}/activate`
  },

  EMPLOYEES: {
    BY_ID: (id) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
    SEARCH: '/employees/search',
    ACTIVATE: (id) => `/employees/${id}/activate`
  },

  ROLES: {
    ALL: '/roles',
    BY_ID: (id) => `/roles/${id}`
  },

  VEHICLES: {
    BASE: '/vehicles',
    OPEN: '/vehicles/open',
    BY_ID: (id) => `/vehicles/open/${id}`,
    SEARCH: '/vehicles/open/search',
    CREATE: '/vehicles',
    UPDATE: (id) => `/vehicles/${id}`,
    DELETE: (id) => `/vehicles/${id}`,
    MAINTENANCE_INBOX: '/vehicles/finMantenimiento'
  },

  IMAGES: {
    USER_BY_ID: (userId) => `/images/users/${userId}`,
    EMPLOYEE_BY_ID: (employeeId) => `/images/employees/${employeeId}`,
    VEHICLE_BY_ID: (vehicleId) => `/images/vehicles/${vehicleId}`,
    BY_ID: (imageId) => `/images/${imageId}`
  },

  CLOUDINARY: {
    SIGNATURE: '/open/cloudinary/signature'
  },

  CONFIG: {
    IMAGE_UPLOAD: '/open/config/image-upload',
    FILTER_RANGES: '/open/config/filter-ranges'
  },

  VEHICLE_CATEGORIES: {
    ALL: (isoCode) => `/open/vehicle-categories?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
    BY_ID: (id, isoCode) => `/open/vehicle-categories/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
  },

  HEADQUARTERS: {
    ALL: '/headquarters/open',
    BY_ID: (id) => `/headquarters/${id}`,
    CREATE: '/headquarters',
    UPDATE: (id) => `/headquarters/${id}`,
    DELETE: (id) => `/headquarters/${id}`
  },

  RESERVATIONS: {
    BY_ID: (id) => `/reservations/${id}`,
    CREATE: '/reservations',
    UPDATE: (id) => `/reservations/${id}`,
    DELETE: (id) => `/reservations/${id}`,
    SEARCH: '/reservations/search',
    ESTIMATE: '/reservations/estimate',
    GENERATE_PICKUP_CODE: (id) => `/reservations/${id}/generate-pickup-code`,
    VERIFY_PICKUP_CODE: (code) => `/reservations/verify-code/${code}`
  },

  RENTALS: {
    BY_ID: (id) => `/rentals/${id}`,
    CREATE: '/rentals',
    UPDATE: (id) => `/rentals/${id}`,
    DELETE: (id) => `/rentals/${id}`,
    SEARCH: '/rentals/search',
    EXISTS_BY_RESERVATION: (reservationId) => `/rentals/reservations/${reservationId}/exists`,
    FROM_RESERVATION: '/rentals/from-reservation',
    AUTO_CONVERT: '/rentals/auto-convert',
    COMPLETE: (id) => `/rentals/${id}/complete`
  },

  RESERVATION_STATUSES: {
    ALL: (isoCode) => `/reservation-statuses?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
    BY_ID: (id, isoCode) => `/reservation-statuses/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
  },

  RENTAL_STATUSES: {
    ALL: (isoCode) => `/rental-statuses?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
    BY_ID: (id, isoCode) => `/rental-statuses/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
  },

  VEHICLE_STATUSES: {
    ALL: (isoCode) => `/open/vehicle-statuses?isoCode=${normalizeIsoCodeForApi(isoCode)}`,
    BY_ID: (id, isoCode) => `/open/vehicle-statuses/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`
  },

  PROVINCES: {
    ALL: '/provinces',
    BY_ID: (id) => `/provinces/${id}`,
    CREATE: '/provinces',
    UPDATE: (id) => `/provinces/${id}`,
    DELETE: (id) => `/provinces/${id}`
  },

  CITIES: {
    ALL: '/cities/open',
    BY_ID: (id) => `/cities/${id}`,
    BY_PROVINCE: (provinceId) => `/cities/province/${provinceId}`,
    CREATE: '/cities',
    UPDATE: (id) => `/cities/${id}`,
    DELETE: (id) => `/cities/${id}`
  },

  ADDRESSES: {
    BY_ID_OPEN: (id) => `/addresses/open/${id}`,
    CREATE_OPEN: '/addresses/open',
    UPDATE: (id) => `/addresses/${id}`,
    DELETE: (id) => `/addresses/${id}`
  },

  STATISTICS: {
    DASHBOARD: '/statistics/dashboard',
    REVENUE: '/statistics/revenue',
    REVENUE_MONTHLY: '/statistics/revenue/monthly',
    RESERVATIONS: '/statistics/reservations',
    FLEET: '/statistics/fleet',
    HEADQUARTERS: '/statistics/headquarters',
  },

  WEATHER: {
    BY_CITY: (city, lang = 'es') =>
      `/open/weather?city=${encodeURIComponent(city)}&lang=${lang}`,
  },

  RECOMMENDATIONS: {
    CREATE: '/open/recommendations',
  },
};

export default Config;
