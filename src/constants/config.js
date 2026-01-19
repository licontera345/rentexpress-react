export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SEARCH_VEHICLES: '/search-vehicles',
  CATALOG: '/catalog',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MY_RESERVATIONS: '/my-reservations',
  PROFILE: '/profile',
  MANAGE_VEHICLES: '/manage-vehicles',
  ADD_VEHICLE: '/add-vehicle',
  EDIT_VEHICLE: '/edit-vehicle/:vehicleId',
  RESERVATION_DETAILS: '/reservation/:reservationId',
  NOT_FOUND: '/not-found',
};

export const API_ENDPOINTS = {
  SEARCH_VEHICLES: 'vehicles/search',
  GET_ALL_CATEGORIES: 'categories/getAll',
  GET_ALL_CITIES: 'cities/getAll',
  GET_ALL_PROVINCES: 'provinces/getAll',
  GET_ALL_HEADQUARTERS: 'headquarters/getAll',
  GET_VEHICLE: 'vehicles/:id',
  CREATE_VEHICLE: 'vehicles/create',
  UPDATE_VEHICLE: 'vehicles/:id',
  DELETE_VEHICLE: 'vehicles/:id',
  GET_RESERVATIONS: 'reservations',
  CREATE_RESERVATION: 'reservations/create',
  CANCEL_RESERVATION: 'reservations/:id/cancel',
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  GET_PROFILE: 'users/profile',
  UPDATE_PROFILE: 'users/profile',
  UPLOAD_IMAGE: 'images/upload',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_PAGE_SIZE_LARGE: 100,
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

export const RESERVATION_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

export const LOGIN_TYPES = {
  USER: 'user',
  EMPLOYEE: 'employee',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
};

export const DEFAULT_FORM_DATA = {
  VEHICLE: {
    brand: '',
    model: '',
    licensePlate: '',
    dailyPrice: '',
    mileage: '0',
    year: new Date().getFullYear().toString(),
    vin: '',
    categoryId: '',
    description: '',
    status: VEHICLE_STATUS.AVAILABLE,
    images: [],
  },
  LOGIN: {
    username: '',
    password: '',
    loginType: LOGIN_TYPES.USER,
    rememberMe: false,
  },
  REGISTER: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false,
  },
  USER_PROFILE: {
    name: '',
    email: '',
    phone: '',
    document: '',
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
export const CACHE_DURATION = 3600; // 1 hour in seconds
export const SESSION_TIMEOUT = 1800; // 30 minutes in seconds
