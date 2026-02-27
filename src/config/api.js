/**
 * Configuración única de la API.
 * Rutas y nombres alineados con package-rentexpress.json (no normalizar).
 */
import { normalizeIsoCodeForApi } from './isoCode.js';

const devBase = '/rentexpress-rest-api/api';
const prodBase = 'http://localhost:8081/rentexpress-rest-api/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? devBase : prodBase);

const byId = (path) => (id) => `${path}/${id}`;
const withIso = (path) => (isoCode) => `${path}?isoCode=${normalizeIsoCodeForApi(isoCode)}`;
const byIdWithIso = (path) => (id, isoCode) => `${path}/${id}?isoCode=${normalizeIsoCodeForApi(isoCode)}`;

export const api = {
  baseUrl: API_BASE_URL,

  auth: {
    loginUser: '/users/open/authenticate',
    loginEmployee: '/employees/open/authenticate',
    forgotPassword: '/users/open/forgot-password',
    resetPassword: '/users/open/reset-password',
  },

  users: {
    createOpen: '/users/open',
    byId: byId('/users'),
    search: '/users/search',
    activate: (id) => `/users/${id}/activate`,
  },

  employees: {
    byId: byId('/employees'),
    create: '/employees',
    update: byId('/employees'),
    delete: byId('/employees'),
    search: '/employees/search',
    activate: (id) => `/employees/${id}/activate`,
  },

  roles: {
    all: '/roles',
    byId: byId('/roles'),
  },

  vehicles: {
    list: '/vehicles',
    open: '/vehicles/open',
    byId: (id) => `/vehicles/open/${id}`,
    search: '/vehicles/open/search',
    create: '/vehicles',
    update: byId('/vehicles'),
    delete: byId('/vehicles'),
    maintenanceInbox: '/vehicles/finMantenimiento',
  },

  images: {
    user: (userId) => `/images/users/${userId}`,
    employee: (employeeId) => `/images/employees/${employeeId}`,
    vehicle: (vehicleId) => `/images/vehicles/${vehicleId}`,
    byId: byId('/images'),
  },

  cloudinary: {
    signature: '/open/cloudinary/signature',
  },

  config: {
    imageUpload: '/open/config/image-upload',
    filterRanges: '/open/config/filter-ranges',
  },

  vehicleCategories: {
    all: withIso('/open/vehicle-categories'),
    byId: byIdWithIso('/open/vehicle-categories'),
  },

  headquarters: {
    allOpen: '/headquarters/open',
    byId: byId('/headquarters'),
    create: '/headquarters',
    update: byId('/headquarters'),
    delete: byId('/headquarters'),
  },

  reservations: {
    byId: byId('/reservations'),
    create: '/reservations',
    update: byId('/reservations'),
    delete: byId('/reservations'),
    search: '/reservations/search',
    estimate: '/reservations/estimate',
    generatePickupCode: (id) => `/reservations/${id}/generate-pickup-code`,
    verifyCode: (code) => `/reservations/verify-code/${code}`,
  },

  rentals: {
    byId: byId('/rentals'),
    create: '/rentals',
    update: byId('/rentals'),
    delete: byId('/rentals'),
    search: '/rentals/search',
    fromReservation: '/rentals/from-reservation',
    autoConvert: '/rentals/auto-convert',
    complete: (id) => `/rentals/${id}/complete`,
    existsByReservation: (reservationId) => `/rentals/reservations/${reservationId}/exists`,
  },

  reservationStatuses: {
    all: withIso('/reservation-statuses'),
    byId: byIdWithIso('/reservation-statuses'),
  },

  rentalStatuses: {
    all: withIso('/rental-statuses'),
    byId: byIdWithIso('/rental-statuses'),
  },

  vehicleStatuses: {
    all: withIso('/open/vehicle-statuses'),
    byId: byIdWithIso('/open/vehicle-statuses'),
  },

  provinces: {
    all: '/provinces',
    byId: byId('/provinces'),
    create: '/provinces',
    update: byId('/provinces'),
    delete: byId('/provinces'),
  },

  cities: {
    allOpen: '/cities/open',
    byId: byId('/cities'),
    byProvince: (provinceId) => `/cities/province/${provinceId}`,
    create: '/cities',
    update: byId('/cities'),
    delete: byId('/cities'),
  },

  addresses: {
    byIdOpen: (id) => `/addresses/open/${id}`,
    createOpen: '/addresses/open',
    update: byId('/addresses'),
    delete: byId('/addresses'),
  },

  statistics: {
    dashboard: '/statistics/dashboard',
    revenue: '/statistics/revenue',
    revenueMonthly: '/statistics/revenue/monthly',
    reservations: '/statistics/reservations',
    fleet: '/statistics/fleet',
    headquarters: '/statistics/headquarters',
  },

  weather: {
    byCity: (city, lang = 'es') =>
      `/open/weather?city=${encodeURIComponent(city)}&lang=${lang}`,
  },

  recommendations: {
    create: '/open/recommendations',
  },
};

export default api;
