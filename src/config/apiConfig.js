import { normalizeIsoCodeForApi } from './isoCode';

const DEFAULT_BASE = 'http://94.130.104.92:8081/rentexpress-rest-api/api';
/** Base URL de la API. En producción definir VITE_API_BASE_URL en .env */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

/** Base URL para WebSocket (mismo host/puerto que la API, sin /api). */
const WS_BASE_URL = (() => {
  try {
    const u = new URL(API_BASE_URL);
    return `${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}/rentexpress-rest-api`;
  } catch {
    return 'ws://94.130.104.92:8081/rentexpress-rest-api';
  }
})(); 

const Config = {
  API_BASE_URL,
  /** Google OAuth 2.0 client ID. Definir VITE_GOOGLE_CLIENT_ID en .env para login con Google. */
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  AUTH: {
    LOGIN_USER: '/users/open/authenticate',
    LOGIN_EMPLOYEE: '/employees/open/authenticate',
    LOGIN_GOOGLE: '/open/auth/google',
    VERIFY_2FA: '/open/verify-2fa',
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
    ACTIVATE: (id) => `/users/${id}/activate`,
    SETUP_2FA: (id) => `/users/${id}/2fa/setup`,
    CONFIRM_2FA: (id) => `/users/${id}/2fa/confirm`,
    DISABLE_2FA: (id) => `/users/${id}/2fa/disable`
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

  /** Chat de soporte (usuario–empleado). */
  CHAT: {
    /** Listar mis conversaciones (GET). */
    LIST: '/conversations',
    /** Crear conversación (POST). Body: {} o { employeeId } para crear con empleado. */
    CREATE: '/conversations',
    /** Empleados por sede (GET, para cliente). */
    EMPLOYEES_BY_HEADQUARTERS: (headquartersId) => `/conversations/support/employees-by-headquarters?headquartersId=${headquartersId}`,
    /** Buscar usuario por teléfono y obtener/crear conversación (GET, empleado). */
    FIND_BY_PHONE: (phone) => `/conversations/find-by-phone?phone=${encodeURIComponent(phone)}`,
    /** Marcar conversación como leída (PUT). */
    MARK_READ: (id) => `/conversations/${id}/read`,
    /** Actualizar conversación (PUT). Body: { status: "CLOSED" } etc. */
    UPDATE: (id) => `/conversations/${id}`,
    /** Detalle conversación (GET). */
    BY_ID: (id) => `/conversations/${id}`,
    /** Mensajes de una conversación (GET). */
    MESSAGES: (id) => `/conversations/${id}/messages`,
    /** Asignar empleado (PUT, admin/empleado). */
    ASSIGN: (id) => `/conversations/${id}/assign`,
    /** URL WebSocket: conectar a una sala = conversación. Añadir ?token=JWT */
    wsUrl: (conversationId, token) =>
      `${WS_BASE_URL}/ws/chat/${conversationId}${token ? `?token=${encodeURIComponent(token)}` : ''}`,
  },
};

export default Config;
