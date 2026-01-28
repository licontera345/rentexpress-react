export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CATALOG: '/catalog',
  REGISTER: '/register',
  CONTEXT_GUIDE: '/context-guide',
  PRIVACY_POLICY: '/privacy-policy',
  NOT_FOUND: '/not-found',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EMPLOYEE_LIST: '/employees',
  CLIENT_LIST: '/clients',
  VEHICLE_LIST: '/vehicles',
  RESERVATIONS_LIST: '/reservations',
  RENTALS_LIST: '/rentals',
  RESERVATION_CREATE: '/reservations/new',
  MY_RESERVATIONS: '/my-reservations',
  MY_RENTALS: '/my-rentals',
  CHAT_DEMO: '/chat-demo',
};

export const API_ENDPOINTS = {
  SEARCH_VEHICLES: 'vehicles/search',
  GET_ALL_CATEGORIES: 'categories/getAll',
  GET_ALL_CITIES: 'cities/getAll',
  GET_ALL_PROVINCES: 'provinces/getAll',
  GET_ALL_HEADQUARTERS: 'headquarters/getAll',
  GET_VEHICLE: 'vehicles/:id',
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_PAGE_SIZE_LARGE: 100,
  SEARCH_PAGE_SIZE: 25,
  MAX_BUTTONS: 5,
  MAX_PAGE_SIZE: 1000,
};

export const FILTER_DEFAULTS = {
  brand: '',
  minPrice: '',
  maxPrice: '',
  categoryId: '',
  provinceId: '',
  cityId: '',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
};

export const RESERVATION_STATUS = {
  PENDING_ID: 1,
};

export const USER_ROLES = {
  CUSTOMER: 'user',
  EMPLOYEE: 'employee',
};

export const DEFAULT_FORM_DATA = {
  LOGIN: {
    username: '',
    password: '',
    rememberMe: false,
    role: USER_ROLES.CUSTOMER,
  },
  REGISTER: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName1: '',
    lastName2: '',
    birthDate: '',
    phone: '',
    street: '',
    number: '',
    provinceId: '',
    cityId: '',
    acceptTerms: false,
  },
};

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const TIME_FORMATS = {
  SHORT_DATE: 'dd/MM/yyyy',
  LONG_DATE: 'dd \'de\' MMMM \'de\' yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'loggedInUser',
  LEGACY_USER_DATA: 'user',
  PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  REMEMBER_EMAIL: 'rememberEmail',
  REMEMBER_USERNAME: 'rememberUsername',
  THEME: 'rentexpress-theme',
  LOCALE: 'locale',
};

export const AUTH_HEADER = {
  KEY: 'Authorization',
  SCHEME: 'Bearer',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const IMAGE_CONFIG = {
  MAX_SIZE: 5242880, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const DEBOUNCE_DELAY = 300;
export const CACHE_DURATION = 3600;
export const SESSION_TIMEOUT = 1800;
export const DEFAULT_ACTIVE_STATUS = true;
